import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getCatalogItemsByParent = async (parentItemId) => {
  const url = API_PATHS.lookup.itemsByParent(parentItemId);
  const response = await fetchWithAuth(url);
  const data = await response.json();

  return data;
};
