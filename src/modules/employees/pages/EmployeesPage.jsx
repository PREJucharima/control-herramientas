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
} from "@mui/material";

import { Scrollbar } from "@/components/scrollbar";
import { TableDataNotFound, TableToolbar } from "@/components/table";
import { useDebounce } from "@/hooks/useDebounce";
import { useMuiTable } from "@/hooks/useMuiTable";
import {
  EmployeeQuickViewDialog,
  EmployeeTableHead,
  EmployeeTableRow,
  EmployeesHeadingArea,
} from "../components";
import { useFetchEmployees } from "../hooks/useFetchEmployees";

const EmployeesPage = () => {
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

  const viewRut = searchParams.get("rut");
  const openView = (rut) => setParam("rut", rut);
  const closeView = () => setParam("rut", "");

  // 1. LEEMOS EL ESTADO INICIAL DESDE LA URL
  const initialFilters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    syncStatus: searchParams.get("syncStatus") || "",
  };
  const initialSort = {
    order: searchParams.get("order") || "asc",
    orderBy: searchParams.get("orderBy") || "",
  };
  const initialPage = parseInt(searchParams.get("page"), 10) || 1;
  const initialPageSize = parseInt(searchParams.get("pageSize"), 10) || 10;

  // 2. `useMuiTable` ahora solo gestiona la UI del orden y la selección
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

  // 3. `useEmployees` recibe el estado inicial y es nuestra fuente de verdad para los datos
  const {
    employees,
    pagination,
    isLoading,
    error,
    filters,
    setFilters,
    setSort,
    handleChangePage,
    handleChangePageSize,
  } = useFetchEmployees(
    initialFilters,
    initialSort,
    initialPage,
    initialPageSize
  );

  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch, setFilters]);

  // 4. SINCRONIZAMOS LOS CAMBIOS DE ESTADO HACIA LA URL
  useEffect(() => {
    setSort({ order, orderBy });
  }, [order, orderBy, setSort]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);

        // filtros
        filters.search
          ? next.set("search", filters.search)
          : next.delete("search");
        filters.status
          ? next.set("status", filters.status)
          : next.delete("status");
        filters.syncStatus
          ? next.set("syncStatus", filters.syncStatus)
          : next.delete("syncStatus");

        // paginación
        pagination.page > 1
          ? next.set("page", String(pagination.page))
          : next.delete("page");
        pagination.pageSize !== 10
          ? next.set("pageSize", String(pagination.pageSize))
          : next.delete("pageSize");

        // orden
        orderBy !== "" ? next.set("orderBy", orderBy) : next.delete("orderBy");
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

  const pageIds = employees.map((e) => e.id);
  const numSelectedOnPage = selected.filter((id) =>
    pageIds.includes(id)
  ).length;

  return (
    <Box pt={2}>
      <Card sx={{ marginBottom: 3 }}>
        <Box px={2} pt={2}>
          <EmployeesHeadingArea
            title="Empleados"
            value={filters.status}
            onChange={(e, v) =>
              setFilters((f) => ({ ...f, search: "", page: 1, status: v }))
            }
            searchValue={searchInput}
            onSearchChange={(e) => setSearchInput(e.target.value)}
            onClearSearch={() => setSearchInput("")}
            syncStatusValue={filters.syncStatus}
            onSyncStatusChange={(e) =>
              setFilters((f) => ({ ...f, syncStatus: e.target.value, page: 1 }))
            }
            count={pagination.count}
            counts={undefined}
            isLoading={isLoading}
            error={error}
            gridRoute="/catalogos/empleados-grid"
            listRoute="/catalogos/empleados"
          />

          {/* <SearchArea value={filters.search} onChange={handleSearchChange} /> */}
        </Box>

        {selected.length > 0 && (
          <TableToolbar
            selected={selected.length}
            handleDeleteRows={() => {
              /* bulk delete empleados seleccionados */
            }}
          />
        )}

        {!isLoading && !error && (
          <>
            <TableContainer>
              <Scrollbar autoHide={false}>
                <Table sx={{ marginBottom: 1, overflow: "visible" }}>
                  <EmployeeTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={employees.length}
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
                    ) : employees.length === 0 ? (
                      <TableDataNotFound query={filters.search} />
                    ) : (
                      employees.map((emp) => (
                        <EmployeeTableRow
                          key={emp.id}
                          employee={emp}
                          isSelected={isSelected(emp.id)}
                          handleSelectRow={handleSelectRow}
                          onEdit={() =>
                            navigate(
                              `/empleados/${encodeURIComponent(emp.id)}/editar`
                            )
                          }
                          onViewDetails={() => openView(emp.rut)}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <Box padding={1}>
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
          <CircularProgress aria-label="Cargando empleados" />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar empleados: {error.message || "Intenta nuevamente."}
        </Alert>
      )}

      {viewRut && (
        <EmployeeQuickViewDialog
          open={Boolean(viewRut)}
          rut={viewRut}
          onClose={closeView}
        />
      )}
    </Box>
  );
};

export default EmployeesPage;
