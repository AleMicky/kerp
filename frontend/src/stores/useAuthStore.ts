import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PxpUser } from "@/types/auth.types";
import { apiClient } from "@/lib/axios";

interface AuthState {
  user: PxpUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: PxpUser | null) => void;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
        if (typeof window !== "undefined") {
          if (user) {
            localStorage.setItem("pxp_user", JSON.stringify(user));
          } else {
            localStorage.removeItem("pxp_user");
          }
        }
      },

      logout: async () => {
        try {
          await apiClient.post("/api/auth/logout");
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        } finally {
          set({ user: null, isAuthenticated: false });
          if (typeof window !== "undefined") {
            localStorage.removeItem("pxp_user");
            // Redirección completa intencional para limpiar caché y estado en memoria al cerrar sesión
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.href = "/login";
          }
        }
      },

      hasRole: (role: string) => {
        return get().user?.roles?.includes(role) ?? false;
      },
    }),
    {
      name: "pxp_auth_store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Al rehidratar desde localStorage en el cliente, sincronizar si existe pxp_user
        if (typeof window !== "undefined" && !state?.user) {
          try {
            const raw = localStorage.getItem("pxp_user");
            if (raw) {
              const parsed = JSON.parse(raw);
              state?.setUser(parsed);
            }
          } catch {
            // Ignorar errores de parseo
          }
        }
      },
    }
  )
);

