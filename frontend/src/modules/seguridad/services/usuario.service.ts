import { pxpQuery } from "@/lib/pxp-client";
import { PxpResponse } from "@/types/pxp.types";
import { Usuario, UsuarioRol, ListarUsuariosParams } from "../types/usuario.types";

export const UsuarioService = {
  /**
   * Obtiene la lista paginada de usuarios desde sis_seguridad
   */
  async listar({
    start = 0,
    limit = 15,
    filtro = "",
    sort = "desc_person",
    dir = "ASC",
  }: ListarUsuariosParams = {}): Promise<PxpResponse<Usuario>> {
    return pxpQuery<Usuario>(
      "../../sis_seguridad/control/Usuario/listarUsuario",
      {
        start,
        limit,
        sort,
        dir,
        bottom_filter_value: filtro,
      }
    );
  },

  /**
   * Obtiene los roles asignados a un usuario específico
   */
  async listarRoles(id_usuario: number | string): Promise<PxpResponse<UsuarioRol>> {
    return pxpQuery<UsuarioRol>(
      "../../sis_seguridad/control/UsuarioRol/listarUsuarioRol",
      {
        id_usuario,
        start: 0,
        limit: 50,
        sort: "rol",
        dir: "ASC",
      }
    );
  },
};

