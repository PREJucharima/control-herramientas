import { useCallback } from "react";

import { Edit, Visibility } from "@mui/icons-material";
import {
  Checkbox,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";

export default function EmployeeTableRow({
  item,
  isSelected,
  handleSelectRow,
  onEdit,
  onViewDetails,
}) {
  const theme = useTheme();
  const handleCheck = useCallback(
    (e) => handleSelectRow(e, item.id),
    [handleSelectRow, item.id]
  );

  const nombreCompleto =
    [item?.nombre, item?.apellido_paterno, item?.apellido_materno]
      .filter(Boolean)
      .join(" ") || "—";

  const fechaCreacion = (item.fecha_creacion || "").slice(0, 10) || "—";
  const fechaModificacion = (item.fecha_modificacion || "").slice(0, 10) || "—";

  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox
          size="small"
          color="primary"
          checked={isSelected}
          onClick={handleCheck}
        />
      </TableCell>

      <TableCell>{item.rut ?? "—"}</TableCell>
      <TableCell>{nombreCompleto}</TableCell>
      <TableCell>{item.email ?? "—"}</TableCell>
      <TableCell>{item.centrocosto_id ?? "—"}</TableCell>
      <TableCell>{item.empresa ?? "—"}</TableCell>
      <TableCell>{item.sucursal ?? "—"}</TableCell>
      <TableCell>{item.categoria ?? "—"}</TableCell>

      <TableCell>
        <Chip
          size="small"
          label={item.esta_activo ? "Sí" : "No"}
          color={item.esta_activo ? "success" : "error"}
          variant={"outlined"}
          sx={{
            backgroundColor: item.esta_activo
              ? theme.palette.success[100]
              : theme.palette.error[100],
            color: item.esta_activo ? "success.main" : "error.main",
          }}
        />
      </TableCell>

      <TableCell>{fechaCreacion}</TableCell>
      <TableCell>{fechaModificacion}</TableCell>

      <TableCell>
        <IconButton size="small" onClick={() => onViewDetails?.(item.id)}>
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onEdit?.(item.id)}>
          <Edit fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
