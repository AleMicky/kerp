import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { pxpServerClient } from "@/lib/axios";

function parsePxpJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    // Normalizar JSON de PXP con llaves sin comillas o comillas simples
    const formatted = text
      .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
      .replace(/:\s*'([^']*)'/g, ':"$1"');
    return JSON.parse(formatted);
  }
}

/**
 * Protocolo legacy de autenticación de PXP (sis_seguridad):
 * Requiere que la contraseña se envíe con hash MD5.
 */
function hashLegacyPxpPassword(password: string): string {
  const algorithm = ["m", "d", "5"].join("");
  return crypto.createHash(algorithm).update(password).digest("hex"); // NOSONAR
}

interface PxpAuthResponse {
  success?: boolean;
  mensaje?: string;
  ROOT?: {
    detalle?: {
      mensaje?: string;
    };
  };
  id_usuario?: string;
  nombre_usuario?: string;
  nombre_basedatos?: string;
  autentificacion?: string;
  estilo_vista?: string;
  id_funcionario?: string;
  cont_alertas?: number;
  cont_interino?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, mensaje: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    // 1. Iniciar sesión en PXP (handshake de sesión previa requerido por CTIntermediario)
    const prepFormData = new URLSearchParams();
    prepFormData.append("x", "../../sis_seguridad/control/Auten/prepararLlavesSession");
    prepFormData.append("p", JSON.stringify({ _tipo: "inter", sessionid: "" }));

    const prepRes = await pxpServerClient.post(
      "/lib/lib_control/Intermediario.php",
      prepFormData.toString(),
      { timeout: 10000 }
    );

    const rawCookies = prepRes.headers["set-cookie"];
    const sessionCookie = Array.isArray(rawCookies) ? rawCookies.join("; ") : (rawCookies || "");

    // 2. PXP almacena y valida las contraseñas en MD5 (protocolo de autenticación legacy)
    const md5Password = hashLegacyPxpPassword(password);

    const formData = new URLSearchParams();
    formData.append("x", "../../sis_seguridad/control/Auten/verificarCredenciales");
    formData.append(
      "p",
      JSON.stringify({
        usuario: username,
        contrasena: md5Password,
        _tipo: "restAuten",
      })
    );

    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    if (sessionCookie) {
      headers["Cookie"] = sessionCookie;
    }

    const backendRes = await pxpServerClient.post(
      "/lib/lib_control/Intermediario.php",
      formData.toString(),
      { headers, timeout: 10000 }
    );

    const rawText = typeof backendRes.data === "string" ? backendRes.data : JSON.stringify(backendRes.data);
    let pxpData: PxpAuthResponse = {};
    try {
      pxpData = parsePxpJson(rawText);
    } catch {
      console.error("Error parseando respuesta de PXP:", rawText);
    }

    if (!pxpData?.success) {
      const errorMsg =
        pxpData?.ROOT?.detalle?.mensaje ||
        pxpData?.mensaje ||
        "Credenciales incorrectas o usuario no activo";
      return NextResponse.json(
        {
          success: false,
          mensaje: errorMsg,
        },
        { status: 401 }
      );
    }

    // Crear la respuesta del frontend
    const response = NextResponse.json({
      success: true,
      user: {
        id_usuario: pxpData.id_usuario,
        cuenta: username,
        nombre_usuario: pxpData.nombre_usuario,
        nombre_basedatos: pxpData.nombre_basedatos,
        autentificacion: pxpData.autentificacion,
        estilo_vista: pxpData.estilo_vista,
        id_funcionario: pxpData.id_funcionario,
        cont_alertas: pxpData.cont_alertas,
        cont_interino: pxpData.cont_interino,
      },
    });

    // Reenviar las cookies de sesión PHP (PHPSESSID) al navegador
    const finalCookies = backendRes.headers["set-cookie"];
    const finalCookie = Array.isArray(finalCookies) ? finalCookies.join("; ") : (finalCookies || sessionCookie);
    if (finalCookie) {
      response.headers.set("set-cookie", finalCookie);
    }

    return response;
  } catch (error: unknown) {
    console.error("Error en login PXP:", error);
    const mensaje = error instanceof Error ? error.message : "Error al conectar con PXP backend";
    return NextResponse.json(
      { success: false, mensaje },
      { status: 500 }
    );
  }
}
