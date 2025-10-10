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

import { Scrollbar } from "@/components/scrollbar";
import { TableDataNotFound } from "@/components/table";
import { useDebounce } from "@/hooks/useDebounce";
import { useMuiTable } from "@/hooks/useMuiTable";
import {
  ProductsTableHead,
  ProductsTableRow,
  ProductsHeadingArea,
  ProductQuickViewDialog,
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

  // 1) Estado inicial desde URL (sin syncStatus)
  const initialFilters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "", // "activo" | "inactivo" | ""
  };
  const initialSort = {
    order: searchParams.get("order") || "asc",
    orderBy: searchParams.get("orderBy") || "",
  };
  const initialPage = parseInt(searchParams.get("page"), 10) || 1;
  const initialPageSize = parseInt(searchParams.get("pageSize"), 10) || 10;

  // 2) UI de orden y selección
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

  // 3) Datos (mock) + filtros/orden/paginación como “fuente de verdad”
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

  // search input -> filtros + reset page
  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch }));
  }, [debouncedSearch, setFilters]);

  // ordenar (UI -> hook)
  useEffect(() => {
    setSort({ order, orderBy });
  }, [order, orderBy, setSort]);

  // 4) Sincroniza a la URL (sin syncStatus)
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
            gridRoute="/catalogos/productos-grid"
            listRoute="/catalogos/productos"
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
                              `/catalogos/productos/${encodeURIComponent(
                                prod.id
                              )}/editar`
                            )
                          }
                          onViewDetails={() => openView(prod.codigo)}
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
          Error al cargar productos: {error.message || "Intenta nuevamente."}
        </Alert>
      )}

      {viewCode && (
        <ProductQuickViewDialog
          open={Boolean(viewCode)}
          id={viewCode}
          onClose={closeView}
        />
      )}
    </Box>
  );
};

export default ProductsPage;
