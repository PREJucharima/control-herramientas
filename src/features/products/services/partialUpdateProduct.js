import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

/**
 * PATCH parcial de un producto
 * @param {string} productCode
 * @param {Object} payload - p.ej. { estado_producto: 3 } o { esta_activo: false }
 * @returns {Promise<Object>} producto actualizado (según API)
 */
export async function partialUpdateProduct(productCode, payload) {
  const res = await fetchWithAuth(
    API_PATHS.products.partialUpdate(productCode),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (res.status === 204) return {};
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `PATCH failed (${res.status} ${res.statusText})`);
  }
  return res.json();
}

export function changeProductStatus(
  productCode,
  estadoId,
  motivo_estado_producto
) {
  const payload = { estado_producto: estadoId };
  if (motivo_estado_producto?.trim())
    payload.motivo_estado_producto = motivo_estado_producto.trim();
  console.log("Payload for changeProductStatus:", payload);
  return partialUpdateProduct(productCode, payload);
}
