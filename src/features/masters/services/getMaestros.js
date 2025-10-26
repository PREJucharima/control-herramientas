import { fetchWithAuth } from "@/features/auth/services/apiClient";

export const getMaestros = async () => {
  const response = await fetchWithAuth(`api/maestros/definiciones/`);
  const data = await response.json();
  return data;
};
