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
import dayjs from "dayjs";

export default function EmployeeTableRow({
  employee,
  isSelected,
  handleSelectRow,
  onEdit,
  onViewDetails,
}) {
  const theme = useTheme();
  const handleCheck = useCallback(
    (e) => handleSelectRow(e, employee.id),
    [handleSelectRow, employee.id]
  );

  const dateFormat = (dateStr) => {
    return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
  };

  const fechaCreacion = dateFormat(employee.fecha_creacion || "");
  const fechaModificacion = dateFormat(employee.fecha_modificacion || "");

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

      <TableCell>{employee.rut ?? "—"}</TableCell>
      <TableCell sx={{ minWidth: 180 }}>{employee.nombre_completo}</TableCell>
      <TableCell>{employee.email ?? "—"}</TableCell>
      <TableCell sx={{ minWidth: 180 }}>
        {employee.centrocosto?.centro_costo_nombre ?? "No Asignado"}
      </TableCell>
      <TableCell>{employee?.empresa.nombre ?? "—"}</TableCell>

      <TableCell>
        <Chip
          size="small"
          label={employee.esta_activo ? "Sí" : "No"}
          color={employee.esta_activo ? "success" : "error"}
          variant={"outlined"}
          sx={{
            backgroundColor: employee.esta_activo
              ? theme.palette.success[100]
              : theme.palette.error[100],
            color: employee.esta_activo ? "success.main" : "error.main",
          }}
        />
      </TableCell>

      <TableCell>{fechaCreacion}</TableCell>
      <TableCell>{fechaModificacion}</TableCell>

      <TableCell
        align="right"
        sx={{
          whiteSpace: "nowrap",
          position: "sticky",
          right: -1,
          backgroundColor: (theme) => theme.palette.background.paper,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: `-5px 0 5px -5px rgba(0,0,0,0.2)`,
        }}
      >
        <IconButton size="small" onClick={() => onViewDetails?.(employee.id)}>
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onEdit?.(employee.id)}>
          <Edit fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
