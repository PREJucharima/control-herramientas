import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getBranchesLookup = async (companyId) => {
  const queryParams = new URLSearchParams();

  if (companyId) {
    queryParams.append("empresa_id", companyId);
  }

  const url = `${API_PATHS.lookup.branches}?${queryParams.toString()}`;

  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};
