import { useCallback } from "react";
import { Checkbox, TableRow, TableCell, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Visibility } from "@mui/icons-material";

export default function EmployeeTableRow({
  item,
  isSelected,
  handleSelectRow,
  onEdit,
  onViewDetails,
}) {
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
          color={item.esta_activo ? "success" : "default"}
          variant={item.esta_activo ? "filled" : "outlined"}
        />
      </TableCell>

      <TableCell>{fechaCreacion}</TableCell>
      <TableCell>{fechaModificacion}</TableCell>

      <TableCell>
        <IconButton size="small" onClick={() => onViewDetails?.(item.id)}>
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onEdit?.(item.id)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
