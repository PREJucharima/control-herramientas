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
import { useFetchContracts } from "../hooks/useFetchContracts";
import ContractsHeadingArea from "../components/ContractsHeadingArea";
import ContractsTableHead from "../components/ContractsTableHead";
import ContractsTableRow from "../components/ContractsTableRow";
import ContractQuickViewDialog from "../components/ContractQuickViewDialog";

const ContractsPage = () => {
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
    contracts,
    pagination,
    isLoading,
    error,
    filters,
    setFilters,
    setSort,
    handleChangePage,
    handleChangePageSize,
    refresh,
  } = useFetchContracts(
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

  const pageIds = contracts.map((p) => p.id);
  const numSelectedOnPage = selected.filter((id) =>
    pageIds.includes(id)
  ).length;

  return (
    <Box pt={1.5}>
      <Card sx={{ mb: 3 }}>
        <Box px={2} pt={1.5}>
          <ContractsHeadingArea
            title="Contratos"
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
            refresh={refresh}
          />
        </Box>

        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table
              sx={{
                mb: 1,
                overflow: "visible",
              }}
            >
              <ContractsTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={contracts.length}
                numSelected={numSelectedOnPage}
                onSelectAllRows={handleSelectAllRows(pageIds)}
              />
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && error && (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Error al cargar contratos:{" "}
                        {error?.message || "Intenta nuevamente."}
                      </Alert>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && contracts.length === 0 && (
                  <TableDataNotFound query={filters.search} />
                )}

                {!isLoading &&
                  !error &&
                  contracts.length > 0 &&
                  contracts.map((contract) => (
                    <ContractsTableRow
                      key={contract.id}
                      contract={contract}
                      isSelected={isSelected(contract.id)}
                      handleSelectRow={handleSelectRow}
                      onEdit={() =>
                        navigate(
                          `/maestros/contratos/${encodeURIComponent(
                            contract.codigo
                          )}/editar`
                        )
                      }
                      onViewDetails={() => openView(contract.codigo)}
                    />
                  ))}
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
      </Card>

      {viewCode && (
        <ContractQuickViewDialog
          open={Boolean(viewCode)}
          code={viewCode}
          onClose={closeView}
        />
      )}
    </Box>
  );
};

export default ContractsPage;
