import { fetchWithAuth } from "@/auth/services/apiClient";


export const getCatalogs = async () => {
  const response = await fetchWithAuth(`api/catalogos/definiciones/`);
  const data = await response.json();
  return data;
};
