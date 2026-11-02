import { pxpQuery } from "@/lib/pxp-client";
import { PxpResponse } from "@/lib/types";
import { MesTrabajo, IngresoSalida } from "../types/asistencia.types";

export const AsistenciaService = {
  /**
   * Listar períodos / meses de trabajo de asistencia
   */
  async listarMesTrabajo(params: { start?: number; limit?: number; filtro?: string } = {}): Promise<PxpResponse<MesTrabajo>> {
    return pxpQuery<MesTrabajo>(
      "../../sis_asistencia/control/MesTrabajo/listarMesTrabajo",
      {
        start: params.start ?? 0,
        limit: params.limit ?? 20,
        sort: "id_mes_trabajo",
        dir: "DESC",
        bottom_filter_value: params.filtro || "",
      }
    );
  },

  /**
   * Listar registros de ingresos y salidas (marcaciones)
   */
  async listarIngresoSalida(params: { start?: number; limit?: number; filtro?: string } = {}): Promise<PxpResponse<IngresoSalida>> {
    return pxpQuery<IngresoSalida>(
      "../../sis_asistencia/control/IngresoSalida/listarIngresoSalida",
      {
        start: params.start ?? 0,
        limit: params.limit ?? 20,
        sort: "fecha",
        dir: "DESC",
        bottom_filter_value: params.filtro || "",
      }
    );
  },
};

