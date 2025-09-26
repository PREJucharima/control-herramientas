import { fetchWithAuth } from "@/auth/services/apiClient";

export const integrationsEmployees = async () => {
  const res = await fetchWithAuth(`api/integraciones/sincronizar/empleados/`, {
    method: "POST",
  });
  return res.json();
};
