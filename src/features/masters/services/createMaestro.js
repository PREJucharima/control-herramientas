import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const createMaestro = async (payload) => {
  const res = await fetchWithAuth(API_PATHS.masters.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log("Payload enviado desde createMaestro:", payload);
  return res.json();
};
