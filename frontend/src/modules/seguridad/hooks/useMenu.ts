import { useQuery } from "@tanstack/react-query";
import { MenuService } from "../services/menu.service";
import { ListarMenuParams, PxpMenuItem } from "../types/menu.types";

export function useMenu(params: ListarMenuParams = {}) {
  const { system = "ALL", mobile = 0 } = params;

  return useQuery<PxpMenuItem[]>({
    queryKey: ["pxp_menu", { system, mobile }],
    queryFn: () => MenuService.listar({ system, mobile }),
    staleTime: 5 * 60 * 1000, // Caché de 5 minutos
    refetchOnWindowFocus: false,
  });
}

