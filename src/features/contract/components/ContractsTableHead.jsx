import { useCallback } from "react";

import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  styled,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles?.("dark", { backgroundColor: theme.palette.grey[700] }),
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const headCells = [
  { id: "descripcion", label: "Descripción" },
  { id: "fecha_inicio_vigencia", label: "Inicio de vigencia" },
  { id: "fecha_fin_vigencia", label: "Fin de vigencia" },
  { id: "empresa", label: "Empresa" },
  { id: "sucursal", label: "Sucursal" },
  { id: "categoria", label: "Categoria" },
  { id: "esta_activo", label: "Estado del contrato" },
  { id: "actions", label: "Acciones" },
];

export default function ContractsTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = useCallback(
    (property) => (event) => onRequestSort(event, property),
    [onRequestSort]
  );

  return (
    <StyledTableHead>
      <TableRow>
        {headCells.map((h) => (
          <HeaderCell
            key={h.id}
            sortDirection={orderBy === h.id ? order : false}
            sx={(theme) => ({
              ...(h.id === "descripcion" && { pl: 4 }),
              ...(h.id === "actions" && {
                position: "sticky",
                right: -1,
                backgroundColor: theme.palette.grey[100],
                ...theme.applyStyles?.("dark", {
                  backgroundColor: theme.palette.grey[700],
                }),
                zIndex: 1,
              }),
            })}
          >
            {h.id !== "actions" ? (
              <TableSortLabel
                active={orderBy === h.id}
                direction={orderBy === h.id ? order : "asc"}
                onClick={createSortHandler(h.id)}
              >
                {h.label}
                {orderBy === h.id && (
                  <span style={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                )}
              </TableSortLabel>
            ) : (
              h.label
            )}
          </HeaderCell>
        ))}
      </TableRow>
    </StyledTableHead>
  );
}
