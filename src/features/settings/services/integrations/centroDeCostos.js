import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const integrationsCostCenters = async () => {
  const res = await fetchWithAuth(API_PATHS.integrations.syncCostCenters, {
    method: "POST",
  });
  return res.json();
};
