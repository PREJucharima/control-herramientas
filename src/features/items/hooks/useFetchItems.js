import { useEffect, useState } from "react";

import { useItemsStore } from "../states/itemsStore";
import { getItems } from "../services/getItems";

export const useFetchItems = (codigo) => {
  const setItems = useItemsStore((state) => state.setItems);
  const { items } = useItemsStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getItems(codigo);
        setItems(data);
      } catch (err) {
        console.error("Error cargando ítems:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (codigo) fetch();
    else setIsLoading(false);
  }, [codigo, setItems]);

  return { items, isLoading, error };
};
