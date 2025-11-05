import { useCallback, useEffect, useState } from "react";
import { getProductsPaginated } from "../services/getProducts";

export const useFetchProducts = (
  initialFilters,
  initialSort,
  initialPage,
  initialPageSize
) => {
  const [products, setProducts] = useState([]);
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

  useEffect(() => {
    setPagination((prev) => (prev.page !== 1 ? { ...prev, page: 1 } : prev));
  }, [filters.search, filters.status]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ordering = `${sort.order === "desc" ? "-" : ""}${
        sort.orderBy || "codigo"
      }`;

      let esta_activo = null;
      if (filters.status === "active") esta_activo = true;
      if (filters.status === "inactive") esta_activo = false;

      const data = await getProductsPaginated({
        page: pagination.page,
        page_size: pagination.pageSize,
        search: filters.search,
        ordering,
        esta_activo,
      });

      setProducts(data.results || []);
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
    fetchProducts();
  }, [fetchProducts]);

  const handleChangePage = (_e, newPage) =>
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));

  const handleChangePageSize = (e) =>
    setPagination((prev) => ({
      ...prev,
      page: 1,
      pageSize: parseInt(e.target.value, 10),
    }));

  return {
    products,
    pagination,
    isLoading,
    error,
    filters,
    setFilters,
    setSort,
    handleChangePage,
    handleChangePageSize,
  };
};
