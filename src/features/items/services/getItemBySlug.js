import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getItemBySlug = async (codigoCatalogo, codigoItem) => {
  const url = API_PATHS.masterElements.detail(codigoCatalogo, codigoItem);
  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};
