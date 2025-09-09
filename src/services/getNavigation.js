const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getNavigation = async ({ access }) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/seguridad/navegacion/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error al obtener navegación");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getNavigation:", error);
    throw error;
  }
};
