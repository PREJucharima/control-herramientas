import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getObservationById = async (productCode, id) => {
  const url = API_PATHS.productsObservations.detail(productCode, id);
  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};
