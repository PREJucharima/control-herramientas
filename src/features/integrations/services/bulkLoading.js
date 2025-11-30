import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const bulkLoadProducts = async () => {
  const res = await fetchWithAuth(API_PATHS.integrations.bulkLoadProducts, {
    method: "POST",
  });
  return res.json();
};
