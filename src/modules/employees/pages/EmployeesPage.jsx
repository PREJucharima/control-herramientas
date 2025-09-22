import { useCallback, useEffect, useMemo, useState } from "react";

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
import { useNavigate } from "react-router";

import { Scrollbar } from "@/components/scrollbar";
import { TableDataNotFound, TableToolbar } from "@/components/table";
import { getComparator, stableSort, useMuiTable } from "@/hooks/useMuiTable";
import {
  EmployeeTableHead,
  EmployeeTableRow,
  EmployeesHeadingArea,
  SearchArea,
} from "../components";
import { useFetchEmployees } from "../hooks/useFetchEmployees";

const nowISO = new Date().toISOString();

const employeesFakeData = [
  {
    id: 1,
    rut: "11.111.111-1",
    nombre: "Ana",
    apellido_paterno: "Pérez",
    apellido_materno: "Luna",
    email: "ana.perez@example.com",
    centrocosto_id: 101,
    esta_activo: true,
    usuario_creacion: "seed",
    fecha_creacion: nowISO,
    usuario_modificacion: "seed",
    fecha_modificacion: nowISO,
    empresa: 1,
    sucursal: 1,
    categoria: 2,
  },
  {
    id: 2,
    rut: "22.222.222-2",
    nombre: "Bruno",
    apellido_paterno: "García",
    apellido_materno: "Ramos",
    email: "bruno.garcia@example.com",
    centrocosto_id: 102,
    esta_activo: false,
    usuario_creacion: "seed",
    fecha_creacion: nowISO,
    usuario_modificacion: "seed",
    fecha_modificacion: nowISO,
    empresa: 1,
    sucursal: 2,
    categoria: 3,
  },
  {
    id: 3,
    rut: "33.333.333-3",
    nombre: "Carla",
    apellido_paterno: "Torres",
    apellido_materno: "Vega",
    email: "carla.torres@example.com",
    centrocosto_id: 103,
    esta_activo: true,
    usuario_creacion: "seed",
    fecha_creacion: nowISO,
    usuario_modificacion: "seed",
    fecha_modificacion: nowISO,
    empresa: 2,
    sucursal: 1,
    categoria: 1,
  },
];

const EmployeesPage = () => {
  const navigate = useNavigate();
  const { employees = [], isLoading, error } = useFetchEmployees();

  console.log("employees from useFetchEmployees:", employees);
  console.log("employeesFakeData:", employeesFakeData);

  const [filters, setFilters] = useState({ status: "", search: "" });

  // const [params, setParams] = useSearchParams();
  // const viewEmployee = params.get("ver");
  // const openView = (id) => setParams({ ver: String(id) });
  // const closeView = () => {
  //   params.delete("ver");
  //   setParams(params);
  // };

  const {
    page,
    order,
    orderBy,
    selected,
    isSelected,
    rowsPerPage,
    setPage,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage,
  } = useMuiTable({ defaultOrderBy: "rut" });

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
    const withDerived = (employeesFakeData || []).map((x) => {
      const nombre_completo = [
        x?.nombre,
        x?.apellido_paterno,
        x?.apellido_materno,
      ]
        .filter(Boolean)
        .join(" ");
      return { ...x, nombre_completo };
    });

    const sorted = stableSort(withDerived, getComparator(order, orderBy));

    return sorted.filter((it) => {
      if (filters.status === "active" && !it.esta_activo) return false;
      if (filters.status === "inactive" && it.esta_activo) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = [
          it.rut,
          it.nombre,
          it.apellido_paterno,
          it.apellido_materno,
          it.nombre_completo,
          it.email,
          String(it.centrocosto_id ?? ""),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [order, orderBy, filters.status, filters.search]);

  const paginated = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const allIds = useMemo(() => filtered.map((r) => r.id), [filtered]);
  const count = filtered.length;

  return (
    <Box pt={2}>
      <Card sx={{ marginBottom: 3 }}>
        <Box px={2} pt={2}>
          <EmployeesHeadingArea
            value={filters.status}
            title="Empleados"
            onChange={handleChangeTab}
            isLoading={isLoading}
            error={error}
            count={count}
            gridRoute="/catalogos/empleados-grid"
            listRoute="/catalogos/empleados"
          />

          <SearchArea value={filters.search} onChange={handleSearchChange} />
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
                <Table>
                  <EmployeeTableHead
                    order={order}
                    orderBy={orderBy}
                    numSelected={selected.length}
                    rowCount={filtered.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllRows={handleSelectAllRows(allIds)}
                  />
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableDataNotFound query={filters.search} />
                    ) : (
                      paginated.map((emp) => (
                        <EmployeeTableRow
                          key={emp.id}
                          item={emp}
                          isSelected={isSelected(emp.id)}
                          handleSelectRow={handleSelectRow}
                          onEdit={() =>
                            navigate(
                              `/empleados/${encodeURIComponent(emp.id)}/editar`
                            )
                          }
                          onViewDetails={() => {}}
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
    </Box>
  );
};

export default EmployeesPage;
