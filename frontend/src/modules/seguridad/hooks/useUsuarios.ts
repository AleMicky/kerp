import { useQuery } from "@tanstack/react-query";
import { UsuarioService } from "../services/usuario.service";
import { ListarUsuariosParams } from "../types/usuario.types";

export function useUsuarios(params: ListarUsuariosParams = {}) {
  const { start = 0, limit = 15, filtro = "", sort = "desc_person", dir = "ASC" } = params;

  return useQuery({
    queryKey: ["usuarios", { start, limit, filtro, sort, dir }],
    queryFn: async () => {
      const res = await UsuarioService.listar({ start, limit, filtro, sort, dir });
      if (res.tipo === "ERROR") {
        throw new Error(res.mensaje || "Error al obtener usuarios desde PXP");
      }
      return {
        datos: res.datos || [],
        total: Number(res.total) || 0,
      };
    },
  });
}

export function useUsuarioRoles(id_usuario?: number | string | null) {
  return useQuery({
    queryKey: ["usuario_roles", id_usuario],
    queryFn: async () => {
      if (!id_usuario) return [];
      const res = await UsuarioService.listarRoles(id_usuario);
      if (res.tipo === "ERROR") {
        throw new Error(res.mensaje || "Error al obtener roles del usuario");
      }
      return res.datos || [];
    },
    enabled: Boolean(id_usuario),
  });
}

