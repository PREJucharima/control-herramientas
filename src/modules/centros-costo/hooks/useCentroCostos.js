import { useEffect, useState } from "react";

import { useAuthStore } from "@/auth/states/authStore";
import { useCentroCostosStore } from "../states/centroCostosStore";
import { getCentroCostosLookup } from "../services/getCentroCostosLookup";

export const useCentroCostos = () => {
  const user = useAuthStore((state) => state.user);
  const setcentroCostosLookup = useCentroCostosStore(
    (state) => state.setcentroCostosLookup
  );
  const centroCostosLookup = useCentroCostosStore(
    (state) => state.centroCostosLookup
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getCentroCostosLookup();
        setcentroCostosLookup(data);
      } catch (err) {
        console.error("Error cargando maestros lookup:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetch();
    else setLoading(false);
  }, [user, setcentroCostosLookup]);

  return { centroCostosLookup, loading, error };
};
