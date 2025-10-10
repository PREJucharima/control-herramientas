import { useEffect, useState } from "react";

import { useAuthStore } from "@/auth/states/authStore";
import { useCategoriesStore } from "../states/categoriesStore";
import { getCategoriesLookup } from "../services/getCategoriesLookup";

export const useCategoriesLookups = () => {
  const user = useAuthStore((state) => state.user);
  const { categories, setCategories } = useCategoriesStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getCategoriesLookup();
        setCategories(data);
      } catch (err) {
        console.error("Error cargando empresas lookup:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetch();
    else setIsLoading(false);
  }, [user, setCategories]);

  return { categories, isLoading, error };
};
