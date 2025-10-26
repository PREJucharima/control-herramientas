import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const integrationsEmployees = async () => {
  const res = await fetchWithAuth(API_PATHS.integrations.syncEmployees, {
    method: "POST",
  });
  return res.json();
};
