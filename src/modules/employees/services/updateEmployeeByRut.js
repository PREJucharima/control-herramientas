import { fetchWithAuth } from "@/auth/services/apiClient";

export const updateEmployeeByRut = async (rut, payload) => {
  const url = `api/empleados/${encodeURIComponent(rut)}/`;
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
