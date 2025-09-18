import { fetchWithAuth } from "@/auth/services/apiClient";

export const getItemBySlug = async (codigoCatalogo, codigoItem) => {
  const url = `/api/catalogos/${encodeURIComponent(
    codigoCatalogo
  )}/items/${encodeURIComponent(codigoItem)}/`;
  const res = await fetchWithAuth(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};
