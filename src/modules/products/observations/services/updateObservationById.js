import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const updateObservationById = async (productCode, id, payload) => {
  const url = API_PATHS.productsObservations.update(productCode, id);

  const res = await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
};
