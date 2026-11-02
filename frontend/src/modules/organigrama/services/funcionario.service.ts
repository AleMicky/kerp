import { pxpQuery } from "@/lib/pxp-client";
import { PxpResponse } from "@/lib/types";
import { Funcionario, ListarFuncionariosParams } from "../types/funcionario.types";

export const FuncionarioService = {
  /**
   * Obtiene la lista paginada de funcionarios desde sis_organigrama
   */
  async listar({
    start = 0,
    limit = 15,
    filtro = "",
    sort = "desc_person",
    dir = "ASC",
  }: ListarFuncionariosParams = {}): Promise<PxpResponse<Funcionario>> {
    return pxpQuery<Funcionario>(
      "../../sis_organigrama/control/Funcionario/listarFuncionario",
      {
        start,
        limit,
        sort,
        dir,
        bottom_filter_value: filtro,
      }
    );
  },
};

