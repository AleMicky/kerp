export interface PxpUser {
  id_usuario: string;
  nombre_usuario: string;
  cuenta?: string;
  nombre_basedatos: string;
  autentificacion: string;
  estilo_vista?: string;
  id_funcionario?: string;
  cont_alertas?: number;
  cont_interino?: number;
  roles?: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: PxpUser;
  mensaje?: string;
}

