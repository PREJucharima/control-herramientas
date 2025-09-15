import { fetchWithAuth } from "@/auth/services/apiClient";

export const createItem = async (codigoCatalogo, payload) => {
  const res = await fetchWithAuth(
    `api/catalogos/${encodeURIComponent(codigoCatalogo)}/items/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  return res.json();
};
