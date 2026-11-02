import { useQuery } from "@tanstack/react-query";
import { FuncionarioService } from "../services/funcionario.service";
import { ListarFuncionariosParams } from "../types/funcionario.types";

export function useFuncionarios(params: ListarFuncionariosParams = {}) {
  const { start = 0, limit = 15, filtro = "", sort = "desc_person", dir = "ASC" } = params;

  return useQuery({
    queryKey: ["funcionarios", { start, limit, filtro, sort, dir }],
    queryFn: async () => {
      const res = await FuncionarioService.listar({ start, limit, filtro, sort, dir });
      if (res.tipo === "ERROR") {
        throw new Error(res.mensaje || "Error al obtener funcionarios de PXP");
      }
      return {
        datos: res.datos || [],
        total: Number(res.total) || 0,
      };
    },
  });
}

