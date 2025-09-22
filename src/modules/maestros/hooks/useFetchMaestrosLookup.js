import { useEffect, useState } from "react";

import { useAuthStore } from "@/auth/states/authStore";
import { useMaestrosStore } from "../states/maestrosStore";
import { getMaestrosLookup } from "../services/getMaestrosLookup";

export const useFetchMaestrosLookup = () => {
  const user = useAuthStore((state) => state.user);
  const setMaestrosLookup = useMaestrosStore(
    (state) => state.setMaestrosLookup
  );
  const maestrosLookup = useMaestrosStore((state) => state.maestrosLookup);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMaestrosLookup();
        setMaestrosLookup(data);
      } catch (err) {
        console.error("Error cargando maestros lookup:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetch();
    else setLoading(false);
  }, [user, setMaestrosLookup]);

  return { maestrosLookup, loading, error };
};
