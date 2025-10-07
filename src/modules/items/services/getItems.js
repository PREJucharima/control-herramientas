import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getItems = async (codigo) => {
  const response = await fetchWithAuth(API_PATHS.masterElements.list(codigo));
  const data = await response.json();
  return data;
};
