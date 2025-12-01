import { fetchWithAuth } from "@/features/auth/services/apiClient";
import { API_PATHS } from "@/config/apiPaths";

export const getContractsPaginated = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.ordering) queryParams.append("ordering", params.ordering);
  if (params.page) queryParams.append("page", params.page);
  if (params.page_size)
    queryParams.append("page_size", String(params.page_size));
  if (params.search) queryParams.append("search", params.search);
  if (params.esta_activo !== undefined && params.esta_activo !== null) {
    queryParams.append("esta_activo", params.esta_activo);
  }

  const url = `${API_PATHS.contracts.list}?${queryParams.toString()}`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};

export const createContract = async (payload) => {
  const res = await fetchWithAuth(API_PATHS.contracts.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
};

export async function getContractByCode(code) {
  const res = await fetchWithAuth(API_PATHS.contracts.detail(code));
  if (!res.ok) throw new Error(`No se pudo cargar el contrato: ${code}`);
  const data = await res.json();
  return data;
}

export const updateContractByCode = async (code, payload) => {
  const url = API_PATHS.contracts.update(code);
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
