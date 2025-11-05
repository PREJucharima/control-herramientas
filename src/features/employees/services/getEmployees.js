import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

/**
 * Obtiene una lista paginada de empleados.
 * @param {object} params - Los parámetros para la paginación y el filtrado.
 * @param {number} [params.page] - El número de página a solicitar.
 * @param {number} [params.pageSize] - El número de resultados por página.
 * @param {string} [params.search] - Un término de búsqueda.
 * @param {boolean} [params.esta_activo] - Filtra por empleados activos o inactivos.
 * @param {boolean} [params.pendiente_sincronizar] - Filtra por empleados pendientes de sincronizar.
 * @returns {Promise<object>} - El objeto de paginación de la API ({ count, next, previous, results }).
 */
export const getEmployeesPaginated = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.ordering) queryParams.append("ordering", params.ordering);
  if (params.page) queryParams.append("page", params.page);
  if (params.pageSize) queryParams.append("page_size", params.pageSize);
  if (params.search) queryParams.append("search", params.search);

  if (params.esta_activo !== undefined && params.esta_activo !== null) {
    queryParams.append("esta_activo", params.esta_activo);
  }

  if (
    params.pendiente_sincronizar !== undefined &&
    params.pendiente_sincronizar !== null
  ) {
    queryParams.append("pendiente_sincronizar", params.pendiente_sincronizar);
  }

  const url = `${API_PATHS.employees.list}?${queryParams.toString()}`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};
