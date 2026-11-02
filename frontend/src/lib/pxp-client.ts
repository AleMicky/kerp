import { useSyncExternalStore } from "react";
import axios from "axios";
import { apiClient } from "./axios";
import { Funcionario, PxpResponse, PxpUser } from "./types";

let cachedRaw: string | null = null;
let cachedUser: PxpUser | null = null;

export async function login(username: string, password: string): Promise<{ success: boolean; user?: PxpUser; mensaje?: string }> {
  try {
    const res = await apiClient.post<{ success: boolean; user?: PxpUser; mensaje?: string }>(
      "/api/auth/login",
      { username, password }
    );

    const data = res.data;
    if (data.success && data.user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("pxp_user", JSON.stringify(data.user));
      }
    }
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as { success: boolean; user?: PxpUser; mensaje?: string };
    }
    const mensaje = error instanceof Error ? error.message : "Error al conectar con el servidor";
    return { success: false, mensaje };
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/api/auth/logout");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pxp_user");
      window.location.href = "/login";
    }
  }
}

export function getStoredUser(): PxpUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("pxp_user");
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedUser = raw ? (JSON.parse(raw) as PxpUser) : null;
    }
    return cachedUser;
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useStoredUser(): PxpUser | null {
  return useSyncExternalStore(
    subscribe,
    getStoredUser,
    () => null
  );
}

export async function pxpQuery<T = unknown>(
  action: string,
  params: Record<string, unknown> = {}
): Promise<PxpResponse<T>> {
  try {
    const res = await apiClient.post<PxpResponse<T>>("/api/pxp", {
      action,
      params,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as PxpResponse<T>;
    }
    throw error;
  }
}

export async function listarFuncionarios({
  start = 0,
  limit = 20,
  filtro = "",
  sort = "desc_person",
  dir = "ASC",
}: {
  start?: number;
  limit?: number;
  filtro?: string;
  sort?: string;
  dir?: string;
} = {}): Promise<PxpResponse<Funcionario>> {
  return pxpQuery<Funcionario>("../../sis_organigrama/control/Funcionario/listarFuncionario", {
    start,
    limit,
    sort,
    dir,
    bottom_filter_value: filtro,
  });
}

