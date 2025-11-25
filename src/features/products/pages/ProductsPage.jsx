import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
} from "@mui/material";

import { Scrollbar } from "@/components/ui/scrollbar";
import { TableDataNotFound } from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { useMuiTable } from "@/hooks/useMuiTable";
import {
  ProductsTableHead,
  ProductsTableRow,
  ProductsHeadingArea,
  ProductQuickViewDialog,
  ProductObservationsDialog,
  ProductChangeStatusDialog,
  ProductStatusHistoryDialog,
} from "../components";
import { useFetchProducts } from "../hooks/useFetchProducts";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearch = useDebounce(searchInput, 300);

  const setParam = (key, value, opts) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === undefined || value === "") next.delete(key);
    else next.set(key, value);
    setSearchParams(next, opts);
  };

  const viewCode = searchParams.get("view");
  const openView = (codigo) => setParam("view", String(codigo));
  const closeView = () => setParam("view", "");

  const observationCode = searchParams.get("observaciones");
  const openObservation = (codigo) => setParam("observaciones", String(codigo));
  const closeObservation = () => setParam("observaciones", "");

  const historyCode = searchParams.get("historial");
  const openHistory = (codigo) => setParam("historial", String(codigo));
  const closeHistory = () => setParam("historial", "");

  const statusProductCode = searchParams.get("estadoProducto");
  const openChangeStatus = (codigo) =>
    setParam("estadoProducto", String(codigo));
  const closeChangeStatus = () => setParam("estadoProducto", "");

  const initialFilters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
  };
  const initialSort = {
    order: searchParams.get("order") || "asc",
    orderBy: searchParams.get("orderBy") || "",
  };
  const initialPage = parseInt(searchParams.get("page"), 10) || 1;
  const initialPageSize = parseInt(searchParams.get("pageSize"), 10) || 10;

  const {
    order,
    orderBy,
    selected,
    isSelected,
    handleSelectRow,
    handleRequestSort,
    handleSelectAllRows,
  } = useMuiTable({
    defaultOrder: initialSort.order,
    defaultOrderBy: initialSort.orderBy,
  });

  const {
    products,
    pagination,
    isLoading,
    error,
    filters,
    setFilters,
    setSort,
    handleChangePage,
    handleChangePageSize,
  } = useFetchProducts(
    initialFilters,
    initialSort,
    initialPage,
    initialPageSize
  );

  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch }));
  }, [debouncedSearch, setFilters]);

  useEffect(() => {
    setSort({ order, orderBy });
  }, [order, orderBy, setSort]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        filters.search
          ? next.set("search", filters.search)
          : next.delete("search");
        filters.status
          ? next.set("status", filters.status)
          : next.delete("status");

        pagination.page > 1
          ? next.set("page", String(pagination.page))
          : next.delete("page");
        pagination.pageSize !== 10
          ? next.set("pageSize", String(pagination.pageSize))
          : next.delete("pageSize");

        orderBy ? next.set("orderBy", orderBy) : next.delete("orderBy");
        order !== "asc" ? next.set("order", order) : next.delete("order");

        return next.toString() === prev.toString() ? prev : next;
      },
      { replace: true }
    );
  }, [
    filters,
    pagination.page,
    pagination.pageSize,
    order,
    orderBy,
    setSearchParams,
  ]);

  const pageIds = products.map((p) => p.id);
  const numSelectedOnPage = selected.filter((id) =>
    pageIds.includes(id)
  ).length;

  return (
    <Box pt={2}>
      <Card sx={{ mb: 3 }}>
        <Box px={2} pt={2}>
          <ProductsHeadingArea
            title="Productos"
            searchValue={searchInput}
            onSearchChange={(e) => setSearchInput(e.target.value)}
            onClearSearch={() => setSearchInput("")}
            statusValue={filters.status}
            onStatusChange={(v) =>
              setFilters((f) => ({ ...f, status: v, page: 1 }))
            }
            count={pagination.count}
            isLoading={isLoading}
            error={error}
            gridRoute="/maestros/productos-grid"
            listRoute="/maestros/productos"
          />
        </Box>

        {!isLoading && !error && (
          <>
            <TableContainer>
              <Scrollbar autoHide={false}>
                <Table
                  sx={{
                    mb: 1,
                    overflow: "visible",
                  }}
                >
                  <ProductsTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={products.length}
                    numSelected={numSelectedOnPage}
                    onSelectAllRows={handleSelectAllRows(pageIds)}
                  />
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <Alert severity="error">Error al cargar datos.</Alert>
                        </TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableDataNotFound query={filters.search} />
                    ) : (
                      products.map((prod) => (
                        <ProductsTableRow
                          key={prod.id}
                          product={prod}
                          isSelected={isSelected(prod.id)}
                          handleSelectRow={handleSelectRow}
                          onEdit={() =>
                            navigate(
                              `/maestros/productos/${encodeURIComponent(
                                prod.codigo
                              )}/editar`
                            )
                          }
                          onViewDetails={() => openView(prod.codigo)}
                          onViewObservations={() =>
                            openObservation(prod.codigo)
                          }
                          onViewHistory={() => openHistory(prod.codigo)}
                          onChangeStatus={() => openChangeStatus(prod.codigo)}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <Box p={1}>
              <TablePagination
                component="div"
                count={pagination.count}
                page={pagination.page - 1}
                rowsPerPage={pagination.pageSize}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangePageSize}
                showFirstButton
                showLastButton
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
                }
                getItemAriaLabel={(type) => {
                  if (type === "first") return "Primera página";
                  if (type === "last") return "Última página";
                  if (type === "next") return "Página siguiente";
                  return "Página anterior";
                }}
              />
            </Box>
          </>
        )}
      </Card>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress aria-label="Cargando productos" />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar productos: {error?.message || "Intenta nuevamente."}
        </Alert>
      )}

      {viewCode && (
        <ProductQuickViewDialog
          open={Boolean(viewCode)}
          id={viewCode}
          onClose={closeView}
        />
      )}

      {observationCode && (
        <ProductObservationsDialog
          open={Boolean(observationCode)}
          productCode={observationCode}
          onClose={closeObservation}
        />
      )}

      {historyCode && (
        <ProductStatusHistoryDialog
          open={Boolean(historyCode)}
          productCode={historyCode}
          onClose={closeHistory}
        />
      )}

      {statusProductCode && (
        <ProductChangeStatusDialog
          open={Boolean(statusProductCode)}
          productCode={statusProductCode}
          onClose={closeChangeStatus}
        />
      )}
    </Box>
  );
};

export default ProductsPage;
