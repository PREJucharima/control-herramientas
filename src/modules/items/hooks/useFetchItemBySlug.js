import { useEffect, useState } from "react";

import { useItemsStore } from "../states/itemsStore";
import { getItemBySlug } from "../services/getItemBySlug";

export const useFetchItemBySlug = (codigoMaestro, codigoItem) => {
  const setItemBySlug = useItemsStore((s) => s.setItemBySlug);
  const { itemBySlug } = useItemsStore();

  const [loading, setLoading] = useState(Boolean(codigoMaestro && codigoItem));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!codigoMaestro || !codigoItem) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getItemBySlug(codigoMaestro, codigoItem);
        if (!cancelled) setItemBySlug(data);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [codigoMaestro, codigoItem, setItemBySlug]);

  return { itemBySlug, loading, error };
};
