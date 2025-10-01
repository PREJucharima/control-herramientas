import { fetchWithAuth } from "@/auth/services/apiClient";

export const getMaestrosLookup = async () => {
  const response = await fetchWithAuth(`api/catalogos/lookup/tipos/`);
  const data = await response.json();
  return data;
};
