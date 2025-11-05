import { useCallback } from "react";

import { CloudDone, Edit, SyncProblem, Visibility } from "@mui/icons-material";
import {
  Checkbox,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";

export default function EmployeeTableRow({
  employee,
  isSelected,
  handleSelectRow,
  onEdit,
  onViewDetails,
}) {
  const handleCheck = useCallback(
    (e) => handleSelectRow(e, employee.id),
    [handleSelectRow, employee.id]
  );

  const dateFormat = (dateStr) => {
    return dayjs(dateStr).format("DD/MM/YYYY");
  };

  const fechaCreacion = dateFormat(employee.fecha_creacion || "");
  const fechaModificacion = dateFormat(employee.fecha_modificacion || "");

  return (
    <TableRow
      hover
      sx={{
        ...(employee.pendiente_sincronizar && {
          "& td:first-of-type": { position: "relative" },
          "& td:first-of-type::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            bgcolor: "warning.main",
            borderRadius: 1,
          },
        }),
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          size="small"
          color="primary"
          checked={isSelected}
          onClick={handleCheck}
        />
      </TableCell>

      <TableCell sx={{ fontSize: "0.75rem" }}>{employee.rut ?? "—"}</TableCell>
      <TableCell>{employee.nombre_completo}</TableCell>
      <TableCell>{employee.email ?? "—"}</TableCell>
      <TableCell sx={{ fontSize: "0.75rem" }}>
        {employee.centrocosto?.nombre
          ? `${employee.centrocosto?.codigo} - 
        ${employee.centrocosto?.nombre}`
          : "No Asignado"}
      </TableCell>
      <TableCell sx={{ fontSize: "0.75rem" }}>
        {employee?.empresa.nombre ?? "No Asignado"}
      </TableCell>
      <TableCell>
        <Chip
          size="small"
          label={employee.esta_activo ? "Activo" : "Inactivo"}
          color={employee.esta_activo ? "success" : "error"}
          variant={"outlined"}
        />
      </TableCell>

      <TableCell>
        {employee.pendiente_sincronizar ? (
          <Tooltip title="Hay cambios pendientes desde BUK.">
            <Chip
              size="small"
              color="warning"
              variant="outlined"
              icon={<SyncProblem fontSize="small" />}
              label="Pendiente"
            />
          </Tooltip>
        ) : (
          <Tooltip title="Sincronizado con BUK.">
            <Chip
              size="small"
              color="info"
              variant="outlined"
              icon={<CloudDone fontSize="small" />}
              label="Sincronizado"
            />
          </Tooltip>
        )}
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
          zIndex: 10,
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
