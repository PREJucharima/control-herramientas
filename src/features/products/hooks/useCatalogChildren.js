import { useEffect, useState } from "react";

import { getCatalogItemsByParent } from "../services/getCatalogItemsByParent";

export const useCatalogChildren = (parentItemId) => {
  const [childItems, setChildItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (parentItemId == null) {
      setChildItems([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCatalogItemsByParent(parentItemId);
        setChildItems(data);
      } catch (err) {
        console.error("Error cargando ítems:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (parentItemId) fetch();
    else setIsLoading(false);
  }, [parentItemId, setChildItems]);

  return { childItems, isLoading, error };
};
