import { useCallback, useEffect, useState } from "react";

import { getEmployeesPaginated } from "../services/getEmployees";
// import { useEmployeesStore } from "../states/employeesStore";

export const useFetchEmployees = (
  initialFilters,
  initialSort,
  initialPage,
  initialPageSize
) => {
  // --- ESTADOS INTERNOS ---
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);
  const [pagination, setPagination] = useState({
    count: 0,
    page: initialPage,
    pageSize: initialPageSize,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPagination((prev) => (prev.page !== 1 ? { ...prev, page: 1 } : prev));
  }, [filters.search, filters.status, filters.syncStatus]);

  // --- FUNCIÓN DE FETCHEO ---
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ordering = `${sort.order === "desc" ? "-" : ""}${sort.orderBy}`;

      let estaActivoParam = null;

      if (filters.status === "active") {
        estaActivoParam = true;
      } else if (filters.status === "inactive") {
        estaActivoParam = false;
      }

      let pendSincronizarParam = null;
      if (filters.syncStatus === "pending") {
        pendSincronizarParam = true;
      } else if (filters.syncStatus === "synced") {
        pendSincronizarParam = false;
      }

      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: filters.search,
        ordering: ordering,
        esta_activo: estaActivoParam,
        pendiente_sincronizar: pendSincronizarParam,
      };

      const data = await getEmployeesPaginated(params);

      setEmployees(data.results || []);
      setPagination((prev) => ({ ...prev, count: data.count || 0 }));
    } catch (err) {
      console.error("Error cargando empleados:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    pagination.page,
    pagination.pageSize,
    filters.search,
    sort.order,
    sort.orderBy,
    filters.status,
    filters.syncStatus,
  ]);

  // --- EFECTO PARA RE-FETCHEAR ---
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // --- FUNCIONES PARA LA UI ---
  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangePageSize = (event) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      pageSize: parseInt(event.target.value, 10),
    }));
  };

  // --- VALORES DEVUELTOS ---
  return {
    employees,
    pagination,
    isLoading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
    handleChangePage,
    handleChangePageSize,
  };
};
