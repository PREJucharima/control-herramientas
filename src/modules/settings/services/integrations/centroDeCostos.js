import { fetchWithAuth } from "@/auth/services/apiClient";

export const integrationsCostCenters = async () => {
  const res = await fetchWithAuth(
    `api/integraciones/sincronizar/centrodecostos/`,
    {
      method: "POST",
    }
  );
  return res.json();
};
