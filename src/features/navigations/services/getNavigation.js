import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getNavigation = async () => {
  const response = await fetchWithAuth(API_PATHS.security.navigation);
  const data = await response.json();
  return data;
};
