import { pxpQuery } from "@/lib/pxp-client";
import { PxpMenuItem, ListarMenuParams } from "../types/menu.types";

export const DEFAULT_MENU: PxpMenuItem[] = [
  {
    id_gui: "resumen",
    text: "Resumen",
    type: "hoja",
    component: "Dashboard",
    icon: "LayoutDashboard",
    href: "/dashboard",
  },
  {
    id_gui: "rh",
    text: "Recursos Humanos",
    type: "carpeta",
    icon: "Users",
    childrens: [
      {
        id_gui: "funcionarios",
        text: "Funcionarios",
        type: "hoja",
        component: "Funcionario",
        icon: "Users",
        href: "/dashboard/funcionarios",
      },
      {
        id_gui: "asistencia",
        text: "Asistencia",
        type: "hoja",
        component: "Asistencia",
        icon: "CalendarClock",
        href: "/dashboard/asistencia",
        badge: "Pronto",
      },
    ],
  },
  {
    id_gui: "seguridad",
    text: "Seguridad",
    type: "carpeta",
    icon: "Shield",
    childrens: [
      {
        id_gui: "usuarios",
        text: "Usuarios",
        type: "hoja",
        component: "Usuario",
        icon: "Users",
        href: "/dashboard/seguridad/usuarios",
      },
      {
        id_gui: "roles",
        text: "Roles",
        type: "hoja",
        component: "Rol",
        icon: "Shield",
        href: "/dashboard/seguridad/roles",
      },
    ],
  },
];

/**
 * Servicio para consultar el menú dinámico de PXP desde sis_seguridad
 */
export const MenuService = {
  /**
   * Obtiene el árbol completo del menú en formato JSON para el usuario autenticado
   */
  async listar(params: ListarMenuParams = {}): Promise<PxpMenuItem[]> {
    const { system = "ALL", mobile = 0 } = params;

    try {
      const res = await pxpQuery<Record<string, unknown>>(
        "../../sis_seguridad/control/Menu/getMenuJSON",
        {
          system,
          mobile,
        }
      );

      // Si PXP reporta error de sesión u otro
      if (res.tipo === "ERROR") {
        console.warn("Aviso PXP al consultar menú:", res.mensaje);
        return DEFAULT_MENU;
      }

      let rawMenu: unknown = null;

      // PXP puede devolver los datos directamente en res.datos o en res.datos.resp_json
      if (Array.isArray(res.datos)) {
        rawMenu = res.datos;
      } else if (res.datos && typeof res.datos === "object") {
        const datosObj = res.datos as Record<string, unknown>;
        if (datosObj.resp_json) {
          if (typeof datosObj.resp_json === "string") {
            try {
              rawMenu = JSON.parse(datosObj.resp_json);
            } catch {
              rawMenu = null;
            }
          } else {
            rawMenu = datosObj.resp_json;
          }
        }
      }

      if (Array.isArray(rawMenu) && rawMenu.length > 0) {
        return rawMenu as PxpMenuItem[];
      }

      return DEFAULT_MENU;
    } catch (err: unknown) {
      console.warn("No se pudo cargar el menú desde PXP, usando fallback:", err);
      return DEFAULT_MENU;
    }
  },
};

/**
 * Resuelve la ruta frontend para un ítem del menú de PXP
 */
export function getRouteForMenuItem(item: PxpMenuItem): string {
  if (item.href) return item.href;
  if (!item.component && !item.text) return "#";

  const key = `${item.component || ""} ${item.text}`.toLowerCase();

  if (key.includes("funcionario")) return "/dashboard/funcionarios";
  if (key.includes("usuario") || key.includes("user")) return "/dashboard/seguridad/usuarios";
  if (key.includes("rol")) return "/dashboard/seguridad/roles";
  if (key.includes("asistencia") || key.includes("marcac")) return "/dashboard/asistencia";
  if (key.includes("dashboard") || key.includes("resumen") || key.includes("inicio")) return "/dashboard";

  return `/dashboard/${encodeURIComponent(item.component || String(item.id_gui))}`;
}

