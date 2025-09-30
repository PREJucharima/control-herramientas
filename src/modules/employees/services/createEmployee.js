import { fetchWithAuth } from "@/auth/services/apiClient";

export const createEmployee = async (payload) => {
  const res = await fetchWithAuth(`api/empleados/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
};
