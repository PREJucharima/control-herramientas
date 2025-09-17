import { useEffect, useState } from "react";
import { useAuthStore } from "@/auth/states/authStore";
import { useMaestrosStore } from "../states/maestrosStore";
import { getMaestros } from "../services/getMaestros";

export const useFetchMaestros = () => {
  const user = useAuthStore((state) => state.user);
  const setMaestros = useMaestrosStore((state) => state.setMaestros);
  const { maestros } = useMaestrosStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMaestros();
        setMaestros(data);
      } catch (err) {
        console.error("Error cargando catálogos:", err);
        setError(
          "No se pudieron cargar los datos. Por favor, intente más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetch();
    else setIsLoading(false);
  }, [user, setMaestros]);

  return { maestros, isLoading, error };
};
