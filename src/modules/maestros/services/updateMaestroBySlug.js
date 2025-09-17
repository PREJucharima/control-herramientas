import { fetchWithAuth } from "@/auth/services/apiClient";

export const updateMaestroBySlug = async (codigoUnico, payload) => {
  const url = `api/catalogos/definiciones/${encodeURIComponent(codigoUnico)}/`;

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
