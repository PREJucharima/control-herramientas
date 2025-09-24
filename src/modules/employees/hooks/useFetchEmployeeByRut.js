import { useEffect, useState } from "react";

import { useAuthStore } from "@/auth/states/authStore";
import { getEmployeeById } from "../services/getEmployeeById";
import { useEmployeesStore } from "../states/employeesStore";

export const useFetchEmployeeByRut = (rut) => {
  const user = useAuthStore((state) => state.user);
  const setEmployeeById = useEmployeesStore((s) => s.setEmployeeById);
  const { employeeById } = useEmployeesStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getEmployeeById(rut);
        setEmployeeById(data);
      } catch (err) {
        console.error("Error cargando empleados:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetch();
    else setIsLoading(false);
  }, [user, setEmployeeById, rut]);

  return { employeeById, isLoading, error };
};
