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
}

export interface PxpResponse<T = unknown> {
  total?: number | string;
  datos?: T[];
  success?: boolean;
  tipo?: string;
  mensaje?: string;
}

export interface Funcionario {
  id_funcionario: number | string;
  id_persona?: number | string;
  desc_person?: string;
  codigo?: string;
  email_empresa?: string;
  interno?: string;
  fecha_ingreso?: string;
  estado_reg?: string;
}

