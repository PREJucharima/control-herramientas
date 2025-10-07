import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const updateItemBySlug = async (codigoMaestro, codigoItem, payload) => {
  const url = API_PATHS.masterElements.update(codigoMaestro, codigoItem);

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

export const patchItemBySlug = async (codigoMaestro, codigoItem, patch) => {
  const url = API_PATHS.masterElements.partialUpdate(codigoMaestro, codigoItem);

  const res = await fetchWithAuth(url, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
};
