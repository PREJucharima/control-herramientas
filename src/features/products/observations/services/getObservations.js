import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getObservations = async (productCode) => {
  const response = await fetchWithAuth(
    API_PATHS.productsObservations.list(productCode)
  );
  const data = await response.json();
  return data;
};
