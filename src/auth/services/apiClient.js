import { useAuthStore } from "@/auth//states/authStore";

export async function fetchWithAuth(url, options = {}) {
  const accessToken = useAuthStore.getState().access;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    console.error("Error 401: Token expirado o inválido. Cerrando sesión.");
    useAuthStore.getState().logout();
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "No se pudo leer el cuerpo del error");
    throw new Error(`Error en la petición: ${response.status} ${errorBody}`);
  }

  return response;
}