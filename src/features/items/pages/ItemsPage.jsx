import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from "@mui/material";

import { Scrollbar } from "@/components/ui/scrollbar";
import { TableDataNotFound } from "@/components/ui/table";
import { getComparator, stableSort, useMuiTable } from "@/hooks/useMuiTable";
import { useMaestrosStore } from "@/features/masters/states/maestrosStore";
import {
  ItemQuickViewDialog,
  ItemTableHead,
  ItemTableRow,
  ItemsHeadingArea,
  SearchArea,
} from "../components";
import { useFetchItems } from "../hooks/useFetchItems";

const ItemsPage = () => {
  const { codigo } = useParams();
  const { items = [], isLoading, error } = useFetchItems(codigo);
  const { maestros } = useMaestrosStore();
  const navigate = useNavigate();

  const maestroCurrent = maestros?.find((m) => m.codigo_unico === codigo);
  const maestroName = maestroCurrent?.nombre;

  const [filters, setFilters] = useState({ status: "", search: "" });

  const [params, setParams] = useSearchParams();
  const viewItem = params.get("ver");

  const openView = (slug) => setParams({ ver: slug });
  const closeView = () => {
    params.delete("ver");
    setParams(params);
  };

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    handleChangePage,
    handleRequestSort,
    handleChangeRowsPerPage,
  } = useMuiTable({ defaultOrderBy: "codigo" });

  useEffect(() => {
    setPage(0);
  }, [filters, setPage]);

  const handleChangeTab = useCallback((_, v) => {
    setFilters((f) => ({ ...f, status: v }));
  }, []);
  const handleSearchChange = useCallback((e) => {
    setFilters((f) => ({ ...f, search: e.target.value }));
  }, []);

  const filtered = useMemo(() => {
    const withDerived = (items || []).map((x) => ({
      ...x,
      tipo_nombre: x?.tipo_catalogo?.nombre ?? "",
    }));

    const sorted = stableSort(withDerived, getComparator(order, orderBy));

    return sorted.filter((it) => {
      if (filters.status === "active" && !it.esta_activo) return false;
      if (filters.status === "inactive" && it.esta_activo) return false;

      if (filters.search) {
        const haystack = [
          it.codigo,
          it.descripcion,
          it.descripcion_corta,
          it.tipo_nombre,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(filters.search.toLowerCase())) return false;
      }
      return true;
    });
  }, [items, order, orderBy, filters.status, filters.search]);

  const paginated = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const count = filtered.length;

  return (
    <Box pt={2}>
      <Card sx={{ marginBottom: 3 }}>
        <Box px={2} pt={2}>
          <ItemsHeadingArea
            value={filters.status}
            title={maestroName}
            onChange={handleChangeTab}
            isLoading={isLoading}
            error={error}
            count={count}
          />

          <SearchArea value={filters.search} onChange={handleSearchChange} />
        </Box>

        {!isLoading && !error && (
          <>
            <TableContainer>
              <Scrollbar autoHide={false}>
                <Table>
                  <ItemTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableDataNotFound query={filters.search} />
                    ) : (
                      paginated.map((item) => (
                        <ItemTableRow
                          key={item.id}
                          item={item}
                          onEdit={() => {
                            navigate(
                              `/maestros/catalogos/${encodeURIComponent(
                                codigo
                              )}/${encodeURIComponent(item.codigo)}/editar`
                            );
                          }}
                          onViewDetails={() => openView(item.codigo)}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <Box padding={1}>
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={count}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
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

      {viewItem && (
        <ItemQuickViewDialog
          open={Boolean(viewItem)}
          maestroSlug={codigo}
          itemSlug={viewItem}
          onClose={closeView}
        />
      )}

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress aria-label="Cargando ítems" />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar ítems: {error.message || "Intenta nuevamente."}
        </Alert>
      )}
    </Box>
  );
};

export default ItemsPage;
