export interface MesTrabajo {
  id_mes_trabajo: number | string;
  id_periodo?: number | string;
  mes?: number | string;
  gestion?: number | string;
  estado?: string;
  fecha_ini?: string;
  fecha_fin?: string;
}

export interface IngresoSalida {
  id_ingreso_salida: number | string;
  id_funcionario?: number | string;
  desc_funcionario?: string;
  fecha?: string;
  hora_ingreso?: string;
  hora_salida?: string;
  estado?: string;
}

