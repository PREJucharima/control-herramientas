import { useEffect, useState } from "react";
import { useAuthStore } from "@/auth/states/authStore";
import { useMaestrosStore } from "../states/maestrosStore";
import { getMaestros } from "../services/getMaestros";

export const useFetchMaestros = () => {
  const user = useAuthStore((state) => state.user);
  const setMaestros = useMaestrosStore((state) => state.setMaestros);
  const { maestros } = useMaestrosStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMaestros();
        setMaestros(data);
      } catch (err) {
        console.error("Error cargando catálogos:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetch();
    else setLoading(false);
  }, [user, setMaestros]);

  return { maestros, loading, error };
};
