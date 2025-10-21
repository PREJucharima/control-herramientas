import { useCallback, useEffect, useState } from "react";

import { getObservations } from "../services/getObservations";

export const useObservations = (productCode) => {
  const [observations, setObservations] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchObservations = useCallback(async () => {
    if (!productCode) {
      setObservations([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getObservations(productCode);
      setObservations(data?.results ?? []);
    } catch (err) {
      console.error("Error cargando observaciones:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [productCode]);

  useEffect(() => {
    fetchObservations();
  }, [fetchObservations]);

  // useEffect(() => {
  //   const fetch = async () => {
  //     setIsLoading(true);
  //     setError(null);
  //     try {
  //       const data = await getObservations(productCode);
  //       setObservations(data.results || []);
  //     } catch (err) {
  //       console.error("Error cargando observaciones:", err);
  //       setError(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (productCode) fetch();
  //   else setIsLoading(false);
  // }, [productCode, setObservations]);

  return { observations, isLoading, error, refetch: fetchObservations };
};
