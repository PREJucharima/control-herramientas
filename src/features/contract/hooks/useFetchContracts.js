import { useCallback, useEffect, useState } from "react";
import { getContractsPaginated } from "../services/contractService";

export const useFetchContracts = (
  initialFilters,
  initialSort,
  initialPage,
  initialPageSize
) => {
  const [contracts, setContracts] = useState([]);
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    status: initialFilters.status || "",
  });
  const [sort, setSort] = useState({
    order: initialSort.order || "asc",
    orderBy: initialSort.orderBy || "codigo",
  });
  const [pagination, setPagination] = useState({
    count: 0,
    page: initialPage || 1,
    pageSize: initialPageSize || 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const setFiltersWithReset = useCallback((updateAction) => {
    setFilters((prevFilters) => {
      const nextFilters =
        typeof updateAction === "function"
          ? updateAction(prevFilters)
          : updateAction;

      const hasChanged =
        prevFilters.search !== nextFilters.search ||
        prevFilters.status !== nextFilters.status;

      if (hasChanged) {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }

      return nextFilters;
    });
  }, []);

  const fetchContracts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ordering = `${sort.order === "desc" ? "-" : ""}${
        sort.orderBy || "codigo"
      }`;

      let esta_activo = null;
      if (filters.status === "active") esta_activo = true;
      if (filters.status === "inactive") esta_activo = false;

      const data = await getContractsPaginated({
        page: pagination.page,
        page_size: pagination.pageSize,
        search: filters.search,
        ordering,
        esta_activo,
      });

      setContracts(data.results || []);
      setPagination((prev) => ({ ...prev, count: data.count || 0 }));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    pagination.page,
    pagination.pageSize,
    filters.search,
    filters.status,
    sort.order,
    sort.orderBy,
  ]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleChangePage = (_e, newPage) =>
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));

  const handleChangePageSize = (e) =>
    setPagination((prev) => ({
      ...prev,
      page: 1,
      pageSize: parseInt(e.target.value, 10),
    }));

  return {
    contracts,
    pagination,
    isLoading,
    error,
    filters,
    setFilters: setFiltersWithReset,
    setSort,
    handleChangePage,
    handleChangePageSize,
    refresh: fetchContracts,
  };
};
