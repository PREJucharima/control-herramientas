import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getProductsPaginated = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.ordering) queryParams.append("ordering", params.ordering);
  if (params.page) queryParams.append("page", params.page);
  if (params.page_size)
    queryParams.append("page_size", String(params.page_size));
  if (params.search) queryParams.append("search", params.search);
  if (params.esta_activo !== undefined && params.esta_activo !== null) {
    queryParams.append("esta_activo", params.esta_activo);
  }

  const url = `${API_PATHS.products.list}?${queryParams.toString()}`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};
