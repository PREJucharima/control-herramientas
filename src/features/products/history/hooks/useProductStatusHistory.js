import { useCallback, useEffect, useState } from "react";
import { getProductStatusHistory } from "../services/getProductStatusHistory";

export function useProductStatusHistory(
  productCode,
  initialPage = 1,
  initialPageSize = 10
) {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    page: initialPage,
    pageSize: initialPageSize,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // si cambia el producto, vuelve a la página 1
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [productCode]);

  const fetchHistory = useCallback(async () => {
    if (!productCode) {
      setHistory([]);
      setPagination((p) => ({ ...p, count: 0 }));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductStatusHistory(productCode, {
        page: pagination.page,
        page_size: pagination.pageSize,
      });
      setHistory(data?.results ?? []);
      setPagination((prev) => ({ ...prev, count: data?.count ?? 0 }));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [productCode, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleChangePage = (_e, newPage) =>
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));

  const handleChangePageSize = (e) =>
    setPagination((prev) => ({
      ...prev,
      page: 1,
      pageSize: parseInt(e.target.value, 10),
    }));

  return {
    history,
    pagination,
    isLoading,
    error,
    refetch: fetchHistory,
    handleChangePage,
    handleChangePageSize,
  };
}
