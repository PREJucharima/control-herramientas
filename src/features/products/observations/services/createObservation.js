import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const createObservation = async (productCode, payload) => {
  const res = await fetchWithAuth(
    API_PATHS.productsObservations.create(productCode),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  return res.json();
};
