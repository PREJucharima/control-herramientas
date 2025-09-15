import { useEffect, useState } from "react";
import { useAuthStore } from "@/auth/states/authStore";
import { useCatalogsStore } from "../states/catalogsStore";
import { getCatalogs } from "../services/getCatalogs";

export const useFetchCatalogs = () => {
  const user = useAuthStore((state) => state.user);
  const setCatalogs = useCatalogsStore((state) => state.setCatalogs);
  const { catalogs } = useCatalogsStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getCatalogs();
        setCatalogs(data);
      } catch (err) {
        console.error("Error cargando catálogos:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetch();
    else setLoading(false);
  }, [user, setCatalogs]);

  return { catalogs, loading, error };
};
