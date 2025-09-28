import { fetchWithAuth } from "@/auth/services/apiClient";

export async function getEmployeeByRut(id) {
  const res = await fetchWithAuth(`api/empleados/${id}/`);
  if (!res.ok) throw new Error(`No se pudo cargar el empleado: ${id}`);
  const data = await res.json();
  return data;
}
