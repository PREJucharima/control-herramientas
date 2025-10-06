import { useEffect, useState } from "react";

import { useAuthStore } from "@/auth/states/authStore";
import { getCentroCostosLookup } from "../services/getCentroCostosLookup";
import { useCentroCostosStore } from "../states/centroCostosStore";

export const useCentroCostos = (companyId) => {
  const user = useAuthStore((state) => state.user);
  const centroCostosLookup = useCentroCostosStore(
    (state) => state.centroCostosLookup
  );
  const setcentroCostosLookup = useCentroCostosStore(
    (state) => state.setcentroCostosLookup
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) {
      setcentroCostosLookup([]);
      return;
    }

    const fetchCostos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getCentroCostosLookup(companyId);
        setcentroCostosLookup(data);
      } catch (err) {
        console.error("Error cargando maestros lookup:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchCostos();
    else setIsLoading(false);
  }, [user, companyId, setcentroCostosLookup]);

  return { centroCostosLookup, isLoading, error };
};
