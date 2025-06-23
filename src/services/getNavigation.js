const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getNavigation = async ({ token, rol_id }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Navegacion/${rol_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Error al obtener navegación');
    
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error en getNavigation:', error);
    throw error;
  }
};
