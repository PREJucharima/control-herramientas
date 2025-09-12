import { useAuthStore } from "@/auth//states/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchWithAuth(endpoint, options = {}) {
  const { access, refresh, setNewAccessToken, logout } =
    useAuthStore.getState();

  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (access) {
    headers["Authorization"] = `Bearer ${access}`;
  }

  let response = await fetch(url, { ...options, headers });

  console.log(response);
  console.log("Fetch realizado a:", url);
  console.log("Estado de la respuesta:", response.status);
  console.log("Headers de la petición:", headers);
  console.log("Access token usado:", { access });
  console.log("Refresh token disponible:", { refresh });

  // Si la respuesta es 401, intentamos refrescar el token
  if (response.status === 401 && refresh) {
    try {
      console.log("Access token expirado. Intentando refrescar...");
      const refreshResponse = await fetch(`${API_BASE_URL}api/seguridad/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (!refreshResponse.ok) throw new Error("Refresh token inválido");

      const data = await refreshResponse.json();
      const newAccessToken = data.access;
      setNewAccessToken(newAccessToken); // Guardamos el nuevo token en el store

      console.log("Token refrescado. Reintentando petición original...");

      // Reintentamos la petición original con el nuevo token
      headers["Authorization"] = `Bearer ${newAccessToken}`;
      response = await fetch(url, { ...options, headers });
    } catch (error) {
      console.log("No se pudo refrescar el token. Cerrando sesión.", error);
      logout();
      window.location.href = "/login";
      return Promise.reject(error);
    }
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Error en la petición");
    throw new Error(`Error ${response.status}: ${errorBody}`);
  }

  return response;
}
