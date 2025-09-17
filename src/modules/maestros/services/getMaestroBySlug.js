import { fetchWithAuth } from "@/auth/services/apiClient";

export async function getMaestroBySlug(codigoUnico) {
  const res = await fetchWithAuth(`api/catalogos/definiciones/${codigoUnico}/`);
  if (!res.ok) throw new Error(`No se pudo cargar el maestro: ${codigoUnico}`);
  const data = await res.json();
  return data;
}
