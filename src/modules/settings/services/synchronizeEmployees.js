import { fetchWithAuth } from "@/auth/services/apiClient";

export const synchronizeEmployees = async () => {
  const res = await fetchWithAuth(`api/integraciones/sincronizar/empleados/`, {
    method: "POST",
  });
  return res.json();
};
