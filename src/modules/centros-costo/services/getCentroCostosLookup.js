import { fetchWithAuth } from "@/auth/services/apiClient";

export const getCentroCostosLookup = async () => {
  const response = await fetchWithAuth(`api/centros-costo/lookup/`);
  const data = await response.json();
  return data;
};
