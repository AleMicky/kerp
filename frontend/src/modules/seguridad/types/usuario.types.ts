import { PxpPaginationParams } from "@/types/pxp.types";

export interface Usuario {
  id_usuario: number | string;
  id_clasificador?: number | string;
  cuenta: string;
  contrasena?: string;
  fecha_caducidad?: string;
  fecha_reg?: string;
  estado_reg?: string;
  estilo?: string;
  id_persona?: number | string;
  desc_person?: string;
  descripcion?: string;
  id_roles?: string;
  autentificacion?: string;
}

export interface UsuarioRol {
  id_usuario_rol: number | string;
  id_rol: number | string;
  id_usuario: number | string;
  fecha_reg?: string;
  estado_reg?: string;
  rol: string;
  usuario?: string;
  nombre?: string; // Nombre del subsistema
}

export type ListarUsuariosParams = PxpPaginationParams;

