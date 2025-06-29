import { useEffect, useState } from "react";
import { useAuthStore } from "@/auth/states/authStore";
import { useNavigationStore } from "@/states/navigationStore";
import { getNavigation } from "@/services/getNavigation";

export const useFetchNavigation = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setMenus = useNavigationStore((state) => state.setMenus);
  const { menus } = useNavigationStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getNavigation({ token, rol_id: user?.rol_id });
        setMenus(data);
      } catch (err) {
        console.error("Error cargando menús:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) fetch();
    else setLoading(false); // No intentes si no hay credenciales
  }, [user, token, setMenus]);

  return { menus, loading, error };
};
