import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const createEmployee = async (payload) => {
  const res = await fetchWithAuth(API_PATHS.employees.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
};
