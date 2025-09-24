import { fetchWithAuth } from "@/auth/services/apiClient";

export const getMaestros = async () => {
  const response = await fetchWithAuth(`api/catalogos/definiciones/`);
  const data = await response.json();
  return data;
};

/**
 * Obtiene una lista paginada de empleados.
 * @param {object} params - Los parámetros para la paginación y el filtrado.
 * @param {number} [params.page] - El número de página a solicitar.
 * @param {number} [params.ordering] - La manera de como debe ordenar la data
 * @param {string} [params.search] - Un término de búsqueda.
 * @returns {Promise<object>} - El objeto de paginación de la API ({ count, next, previous, results }).
 */
export const getMaestrosPaginated = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.ordering) queryParams.append("ordering", params.ordering);
  if (params.page) queryParams.append("page", params.page);
  if (params.search) queryParams.append("search", params.search);

  const url = `api/catalogos/definiciones/?${queryParams.toString()}`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};
