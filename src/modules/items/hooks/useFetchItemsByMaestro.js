import { useEffect, useState } from "react";

import { useItemsStore } from "../states/itemsStore";
import { getItemsByMaestro } from "../services/getItemsByMaestro";

export const useFetchItemsByMaestro = (id) => {
  const setItemsByMaestro = useItemsStore((state) => state.setItemsByMaestro);
  const { itemsByMaestro } = useItemsStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getItemsByMaestro(id);
        setItemsByMaestro(data);
      } catch (err) {
        console.error("Error cargando ítems:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetch();
    else setIsLoading(false);
  }, [id, setItemsByMaestro]);

  return { itemsByMaestro, isLoading, error };
};
