import { useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/states/authStore";
import { useMaestrosStore } from "../states/maestrosStore";
import { getMaestroBySlug } from "../services/getMaestroBySlug";

export const useFetchMaestroBySlug = (codigoUnico) => {
  const user = useAuthStore((state) => state.user);
  const setMaestroBySlug = useMaestrosStore((s) => s.setMaestroBySlug);
  const { maestroBySlug } = useMaestrosStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMaestroBySlug(codigoUnico);
        setMaestroBySlug(data);
      } catch (err) {
        console.error("Error cargando catálogos:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetch();
    else setIsLoading(false);
  }, [user, setMaestroBySlug, codigoUnico]);

  return { maestroBySlug, isLoading, error };
};
