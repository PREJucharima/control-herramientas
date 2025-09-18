import { fetchWithAuth } from "@/auth/services/apiClient";

export const updateItemBySlug = async (codigoMaestro, codigoItem, payload) => {
  const url = `api/catalogos/${encodeURIComponent(
    codigoMaestro
  )}/items/${encodeURIComponent(codigoItem)}/`;

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
  const url = `api/catalogos/${encodeURIComponent(
    codigoMaestro
  )}/items/${encodeURIComponent(codigoItem)}/`;

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
