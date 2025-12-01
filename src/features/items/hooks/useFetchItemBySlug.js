import { useEffect, useState } from "react";

import { getItemBySlug } from "../services/getItemBySlug";

export const useFetchItemBySlug = (codigoMaestro, codigoItem) => {
  const [itemBySlug, setItemBySlug] = useState();

  const [isLoading, setIsLoading] = useState(
    Boolean(codigoMaestro && codigoItem)
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!codigoMaestro || !codigoItem) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getItemBySlug(codigoMaestro, codigoItem);
        if (!cancelled) setItemBySlug(data);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [codigoMaestro, codigoItem, setItemBySlug]);

  return { itemBySlug, isLoading, error };
};
