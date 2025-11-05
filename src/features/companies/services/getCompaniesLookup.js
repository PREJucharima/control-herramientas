import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getCompaniesLookup = async () => {
  const response = await fetchWithAuth(API_PATHS.lookup.companies);
  const data = await response.json();
  return data.results || data;
};
