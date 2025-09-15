import { fetchWithAuth } from "@/auth/services/apiClient";

export const createMaestro = async (payload) => {
  const res = await fetchWithAuth(`api/catalogos/definiciones/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
};
