import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const updateEmployeeByRut = async (rut, payload) => {
  const url = API_PATHS.employees.update(rut);
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
