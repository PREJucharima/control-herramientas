import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getItemsByMaestro = async (id) => {
  const response = await fetchWithAuth(API_PATHS.lookup.itemsByMaster(id));
  const data = await response.json();
  console.log("getItemsByMaestro data:", data);
  return data;
};
