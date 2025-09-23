import { useEffect, useState } from "react";

import { useAuthStore } from "@/auth/states/authStore";
import { getEmployees } from "../services/getEmployees";
import { useEmployeesStore } from "../states/employeesStore";

export const useFetchEmployees = () => {
  const user = useAuthStore((state) => state.user);
  const setEmployees = useEmployeesStore((state) => state.setEmployees);
  const { employees } = useEmployeesStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Error cargando empleados:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetch();
    else setIsLoading(false);
  }, [user, setEmployees]);

  return { employees, isLoading, error };
};
