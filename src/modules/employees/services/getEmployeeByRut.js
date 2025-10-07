import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export async function getEmployeeByRut(rut) {
  const res = await fetchWithAuth(API_PATHS.employees.detail(rut));
  if (!res.ok) throw new Error(`No se pudo cargar el empleado: ${rut}`);
  const data = await res.json();
  return data;
}
