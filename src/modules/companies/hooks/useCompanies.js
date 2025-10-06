import { useEffect, useState } from "react";

import { useAuthStore } from "@/auth/states/authStore";
import { useCompaniesStore } from "../states/companiesStore";
import { getCompaniesLookup } from "../services/getCompaniesLookup";

export const useCompaniesLookups = () => {
  const user = useAuthStore((state) => state.user);
  const { companies, setCompanies } = useCompaniesStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getCompaniesLookup();
        setCompanies(data);
      } catch (err) {
        console.error("Error cargando empresas lookup:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetch();
    else setIsLoading(false);
  }, [user, setCompanies]);

  return { companies, isLoading, error };
};
