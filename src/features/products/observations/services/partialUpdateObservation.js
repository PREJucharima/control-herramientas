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

/** Helpers semánticos (opcionales) */
export const hideObservation = (productCode, id) =>
  partialUpdateObservation(productCode, id, { esta_activo: false });

export const showObservation = (productCode, id) =>
  partialUpdateObservation(productCode, id, { esta_activo: true });

/** Si también manejas pin/unpin desde backend */
export const setPinned = (productCode, id, next) =>
  partialUpdateObservation(productCode, id, { pinned: next });

/** Para edición in-place del texto */
export const updateText = (productCode, id, text) =>
  partialUpdateObservation(productCode, id, { observacion: text });
