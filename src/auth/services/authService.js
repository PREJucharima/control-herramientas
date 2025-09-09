const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT_AUTH = import.meta.env.VITE_ENDPOINT_AUTH;

/**
 * Autentica a un usuario por su email y devuelve los tokens y datos del usuario.
 * Lanza un error si la autenticación falla.
 * @param {string} email - El email del usuario.
 * @returns {Promise<object>} - Una promesa que resuelve con { access, refresh, user }.
 */
export async function loginWithEmail(email) {
  const res = await fetch(`${API_BASE_URL}${ENDPOINT_AUTH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorBody = await res
      .text()
      .catch(() => "No se pudo leer el cuerpo del error");
    throw new Error(`Error de autenticación (${res.status}): ${errorBody}`);
  }

  const data = await res.json();
  if (!data?.access || !data?.user) {
    throw new Error("La respuesta de la API no contiene los datos esperados.");
  }

  return data;
}

export async function refreshAccessToken(refreshToken) {
  const res = await fetch(`${API_BASE_URL}/api/seguridad/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) {
    throw new Error("No se pudo refrescar el token de acceso.");
  }

  return res.json();
}
