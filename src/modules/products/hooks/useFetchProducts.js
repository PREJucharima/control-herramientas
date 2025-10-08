import { useCallback, useEffect, useState } from "react";
import { getProductsPaginated } from "../services/getProductsPaginated"; // ahora es mock

export const useFetchProducts = (
  initialFilters,
  initialSort,
  initialPage,
  initialPageSize
) => {
  // --- ESTADOS ---
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(initialFilters); // { search, status }
  const [sort, setSort] = useState(initialSort); // { order, orderBy }
  const [pagination, setPagination] = useState({
    count: 0,
    page: initialPage,
    pageSize: initialPageSize,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // resetear a página 1 cuando cambian filtros principales
  useEffect(() => {
    setPagination((prev) => (prev.page !== 1 ? { ...prev, page: 1 } : prev));
  }, [filters.search, filters.status]);

  // --- FETCH ---
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ordering = `${sort.order === "desc" ? "-" : ""}${
        sort.orderBy || "codigo"
      }`;

      // mapear status -> esta_activo (true/false/null)
      let estaActivoParam = null;
      if (filters.status === "active") estaActivoParam = true;
      else if (filters.status === "inactive") estaActivoParam = false;

      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: filters.search,
        ordering,
        esta_activo: estaActivoParam,
      };

      const data = await getProductsPaginated(params);

      setProducts(data.results || []);
      setPagination((prev) => ({ ...prev, count: data.count || 0 }));
    } catch (err) {
      console.error("Error cargando productos:", err);
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
    fetchProducts();
  }, [fetchProducts]);

  // --- UI ---
  const handleChangePage = (_e, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangePageSize = (e) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      pageSize: parseInt(e.target.value, 10),
    }));
  };

  return {
    products,
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
