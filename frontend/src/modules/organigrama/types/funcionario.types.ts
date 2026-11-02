export interface Funcionario {
  id_funcionario: number | string;
  id_persona?: number | string;
  desc_person?: string;
  codigo?: string;
  ci?: string;
  email_empresa?: string;
  interno?: string;
  telefono?: string;
  celular?: string;
  nombre_cargo?: string;
  fecha_ingreso?: string;
  estado_reg?: string;
}

export interface ListarFuncionariosParams {
  start?: number;
  limit?: number;
  filtro?: string;
  sort?: string;
  dir?: "ASC" | "DESC";
}

