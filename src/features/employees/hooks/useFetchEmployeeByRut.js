import { useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/states/authStore";
import { getEmployeeByRut } from "../services/getEmployeeByRut";
import { useEmployeesStore } from "../states/employeesStore";

export const useFetchEmployeeByRut = (rut) => {
  const user = useAuthStore((state) => state.user);
  const setEmployeeDetail = useEmployeesStore((s) => s.setEmployeeDetail);
  const { employeeDetail } = useEmployeesStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getEmployeeByRut(rut);
        setEmployeeDetail(data);
      } catch (err) {
        console.error("Error cargando empleados:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetch();
    else setIsLoading(false);
  }, [user, setEmployeeDetail, rut]);

  return { employeeDetail, isLoading, error };
};
