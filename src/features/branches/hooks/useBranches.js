import { useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/states/authStore";
import { getBranchesLookup } from "../services/getBranchesLookup";

export const useBranches = (companyId) => {
  const user = useAuthStore((state) => state.user);
  const [branchesLookup, setBranchesLookup] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) {
      setBranchesLookup([]);
      return;
    }

    const fetchCostos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getBranchesLookup(companyId);
        console.log(data);
        setBranchesLookup(data);
      } catch (err) {
        console.error("Error cargando maestros lookup:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchCostos();
    else setIsLoading(false);
  }, [user, companyId, setBranchesLookup]);

  return { branchesLookup, isLoading, error };
};
