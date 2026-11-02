import { NextRequest, NextResponse } from "next/server";
import { pxpServerClient } from "@/lib/axios";

function parsePxpJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const formatted = text
      .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
      .replace(/:\s*'([^']*)'/g, ':"$1"');
    return JSON.parse(formatted);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, params } = await req.json();

    if (!action) {
      return NextResponse.json(
        { success: false, mensaje: "Se requiere especificar la acción ('x') de PXP" },
        { status: 400 }
      );
    }

    const cookie = req.headers.get("cookie") || "";

    const formData = new URLSearchParams();
    formData.append("x", action);
    formData.append("p", JSON.stringify(params || {}));

    const backendRes = await pxpServerClient.post(
      "/lib/lib_control/Intermediario.php",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          cookie: cookie,
        },
        timeout: 15000,
      }
    );

    const rawText = typeof backendRes.data === "string" ? backendRes.data : JSON.stringify(backendRes.data);

    try {
      const data = parsePxpJson(rawText);
      return NextResponse.json(data);
    } catch {
      // Si la respuesta no es JSON válido (ej. error PHP o HTML)
      return NextResponse.json(
        {
          success: false,
          tipo: "ERROR",
          mensaje: "Respuesta no JSON del servidor PXP",
          raw: rawText,
        },
        { status: 502 }
      );
    }
  } catch (error: unknown) {
    console.error("Error en proxy PXP:", error);
    const mensaje = error instanceof Error ? error.message : "Error de comunicación con PXP";
    return NextResponse.json(
      { success: false, mensaje },
      { status: 500 }
    );
  }
}

