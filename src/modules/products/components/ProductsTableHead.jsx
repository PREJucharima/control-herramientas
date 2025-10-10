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
  { id: "codigo", label: "Código" },
  { id: "estado_producto", label: "Estado del producto" },
  { id: "descripcion", label: "Descripción" },
  { id: "nro_serie", label: "Nro de Serie" },
  { id: "tipo", label: "Tipo" },
  { id: "es_accesorio", label: "Accesorio" },
  { id: "esta_activo", label: "Activo" },
  { id: "empresa", label: "Empresa" },
  { id: "sucursal", label: "Sucursal" },
  { id: "categoria", label: "Categoria" },
  { id: "fecha_creacion", label: "Creación" },
  { id: "fecha_modificacion", label: "Modificación" },
  { id: "actions", label: "Acciones" },
];

export default function ProductsTableHead({ order, orderBy, onRequestSort }) {
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
              ...(h.id === "codigo" && { pl: 2 }),
              ...(h.id === "actions" && {
                position: "sticky",
                right: -1,
                backgroundColor: theme.palette.background.paper,
                zIndex: 1,
                boxShadow: `-2px 0 4px -2px ${theme.palette.divider}`,
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
