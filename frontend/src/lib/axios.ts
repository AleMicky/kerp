import axios from "axios";

/**
 * Instancia de Axios configurada para peticiones desde el cliente hacia las API Routes (/api/...)
 */
export const apiClient = axios.create({
  baseURL: "",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de respuesta para manejar sesiones expiradas y errores comunes
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const isLoginPath = window.location.pathname.startsWith("/login");
      if (!isLoginPath) {
        localStorage.removeItem("pxp_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Instancia de Axios para comunicación desde el backend Next.js (API Routes) hacia el core PXP
 */
const PXP_URL = process.env.PXP_BACKEND_URL || "http://127.0.0.1:8080/kerp";

export const pxpServerClient = axios.create({
  baseURL: PXP_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  responseType: "text",
  validateStatus: () => true, // No lanzar excepciones por códigos HTTP para permitir parseo de respuestas PXP
});

export default apiClient;

