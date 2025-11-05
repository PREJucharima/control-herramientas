import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export async function getProductByCode(code) {
  const res = await fetchWithAuth(API_PATHS.products.detail(code));
  if (!res.ok) throw new Error(`No se pudo cargar el producto: ${code}`);
  const data = await res.json();
  return data;
}
