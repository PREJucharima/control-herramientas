import { fetchWithAuth } from "@/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getProductStatusHistory = async (productCode, params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.page_size)
    queryParams.append("page_size", String(params.page_size));

  const endpoint = `${API_PATHS.productsStatusHistory.list(
    productCode
  )}?${queryParams.toString()}`;

  const response = await fetchWithAuth(endpoint);

  if (!response.ok) {
    throw new Error(
      `Error fetching product status history: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};
