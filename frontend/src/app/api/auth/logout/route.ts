import { NextRequest, NextResponse } from "next/server";
import { pxpServerClient } from "@/lib/axios";

export async function POST(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie") || "";

    const formData = new URLSearchParams();
    formData.append("x", "../../sis_seguridad/control/Auten/cerrarSesion");
    formData.append("p", "{}");

    await pxpServerClient.post("/lib/lib_control/Intermediario.php", formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        cookie: cookie,
      },
      timeout: 10000,
    });

    const response = NextResponse.json({ success: true });
    // Limpiar cookie en el cliente
    response.cookies.delete("PHPSESSID");
    return response;
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : "Error al cerrar sesión";
    return NextResponse.json({ success: false, mensaje }, { status: 500 });
  }
}

