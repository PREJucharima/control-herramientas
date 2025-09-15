import { fetchWithAuth } from "@/auth/services/apiClient";

export const getItems = async (codigo) => {
  const response = await fetchWithAuth(
    `/api/catalogos/${encodeURIComponent(codigo)}/items/`
  );
  const data = await response.json();
  return data;
};
