import { fetchWithAuth } from "@/auth/services/apiClient";

export const getEmployees = async () => {
  const response = await fetchWithAuth(`api/empleados/`);
  const data = await response.json();
  return data;
};
