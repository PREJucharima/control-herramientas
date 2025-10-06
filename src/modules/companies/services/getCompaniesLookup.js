import { API_PATHS } from "@/config/apiPaths";
import { fetchWithAuth } from "@/auth/services/apiClient";

export const getCompaniesLookup = async () => {
  const response = await fetchWithAuth(API_PATHS.lookup.companies);
  const data = await response.json();
  return data.results || data;
};
