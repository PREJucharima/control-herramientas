import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

/**
 * PATCH parcial de una observación
 * @param {string} productCode
 * @param {number|string} id
 * @param {Object} payload - p.ej. { esta_activo: false } o { observacion: "..." }
 * @returns {Promise<Object>} observación actualizada (según API)
 */
export const partialUpdateObservation = async (productCode, id, payload) => {
  const res = await fetchWithAuth(
    API_PATHS.productsObservations.partialUpdate(productCode, id),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  // Swagger muestra 200 con JSON; por si acaso, tolera 204
  if (res.status === 204) return {};
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `PATCH failed (${res.status})`);
  }
  return res.json();
};
