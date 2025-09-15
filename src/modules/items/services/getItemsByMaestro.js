import { fetchWithAuth } from "@/auth/services/apiClient";

export const getItemsByMaestro = async (id) => {
  const response = await fetchWithAuth(`/api/catalogos/lookup/${id}/`);
  const data = await response.json();
  return data;
};
