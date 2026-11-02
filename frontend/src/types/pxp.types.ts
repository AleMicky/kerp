export interface PxpResponse<T = unknown> {
  total?: number | string;
  datos?: T[];
  success?: boolean;
  tipo?: string;
  mensaje?: string;
}

export interface PxpPaginationParams {
  start?: number;
  limit?: number;
  sort?: string;
  dir?: "ASC" | "DESC";
  filtro?: string;
}

export interface PxpActionRequest {
  action: string;
  params?: Record<string, unknown>;
}

