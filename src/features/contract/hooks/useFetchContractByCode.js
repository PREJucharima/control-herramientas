import { useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/states/authStore";
import { getContractByCode } from "../services/contractService";

export const useFetchContractByCode = (code) => {
  const user = useAuthStore((state) => state.user);
  const [contractDetail, setContractDetail] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getContractByCode(code);
        setContractDetail(data);
      } catch (err) {
        console.error(`Error cargando el contrato ${code}:`, err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetch();
    else setIsLoading(false);
  }, [user, setContractDetail, code]);

  return { contractDetail, isLoading, error };
};
