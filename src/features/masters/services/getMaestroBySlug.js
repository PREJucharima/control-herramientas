import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "../../../config/apiPaths";

export async function getMaestroBySlug(codigoUnico) {
  const res = await fetchWithAuth(API_PATHS.masters.detail(codigoUnico));
  if (!res.ok) throw new Error(`No se pudo cargar el maestro: ${codigoUnico}`);
  const data = await res.json();
  return data;
}
