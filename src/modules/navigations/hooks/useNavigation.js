import { useEffect, useState } from "react";

import { useAuthStore } from "@/auth/states/authStore";
import { useNavigationStore } from "@/modules/navigations/states/navigationStore";
import { getNavigation } from "@/modules/navigations/services/getNavigation";

export const useFetchNavigation = () => {
  const user = useAuthStore((state) => state.user);
  // const access = useAuthStore((state) => state.access);
  const setMenus = useNavigationStore((state) => state.setMenus);
  const { menus } = useNavigationStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getNavigation();
        setMenus(data || []);
      } catch (err) {
        console.error("Error cargando menús:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetch();
    else setLoading(false);
  }, [user, setMenus]);

  return { menus, loading, error };
};
