import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getMaestrosLookup = async () => {
  const response = await fetchWithAuth(API_PATHS.lookup.masters);
  const data = await response.json();
  return data;
};
