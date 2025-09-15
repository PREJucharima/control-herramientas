import { useCallback } from "react";
import { styled } from "@mui/material/styles";
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
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
  { id: "codigo", label: "Código" },
  { id: "descripcion", label: "Descripción" },
  { id: "tipo_nombre", label: "Tipo catálogo" },
  { id: "vigencia", label: "Vigencia" },
  { id: "esta_activo", label: "Activo" },
  { id: "fecha_creacion", label: "Creación" },
  { id: "fecha_modificacion", label: "Modificación" },
  { id: "actions", label: "Acciones" },
];

export default function ItemTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  onSelectAllRows,
}) {
  const createSortHandler = useCallback(
    (property) => (event) => onRequestSort(event, property),
    [onRequestSort]
  );

  const isAllSelected = rowCount > 0 && numSelected === rowCount;
  const isIndeterminate = numSelected > 0 && numSelected < rowCount;

  return (
    <StyledTableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            size="small"
            color="primary"
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={onSelectAllRows}
          />
        </TableCell>

        {headCells.map((h) => (
          <HeaderCell
            key={h.id}
            sortDirection={orderBy === h.id ? order : false}
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
