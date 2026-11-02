export * from "@/types/auth.types";
export * from "@/types/pxp.types";

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
