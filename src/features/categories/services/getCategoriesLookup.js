import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getCategoriesLookup = async () => {
  const response = await fetchWithAuth(API_PATHS.lookup.categories);
  const data = await response.json();
  return data.results || data;
};
