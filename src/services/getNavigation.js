import { fetchWithAuth } from "../auth/services/apiClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getNavigation = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}api/seguridad/navegacion/`);
  const data = await response.json();
  return data;
};
