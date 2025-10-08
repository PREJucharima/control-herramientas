import { useCallback } from "react";

import { Edit, Visibility } from "@mui/icons-material";
import { Checkbox, TableRow, TableCell, Chip, IconButton } from "@mui/material";
import dayjs from "dayjs";

export default function ProductsTableRow({
  product,
  isSelected,
  handleSelectRow,
  onEdit,
  onViewDetails,
}) {
  const handleCheck = useCallback(
    (e) => handleSelectRow(e, product.id),
    [handleSelectRow, product.id]
  );

  const dateFormat = (dateStr) => {
    return dayjs(dateStr).format("DD/MM/YYYY");
  };

  const fechaCreacion = dateFormat(product.fecha_creacion || "");
  const fechaModificacion = dateFormat(product.fecha_modificacion || "");

  return (
    <TableRow
      hover
      sx={{
        ...(product.pendiente_sincronizar && {
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

      <TableCell sx={{ fontSize: "0.75rem" }}>
        {product?.codigo ?? "—"}
      </TableCell>
      <TableCell>{product?.estado_producto.nombre ?? "—"}</TableCell>
      <TableCell sx={{ fontSize: "0.75rem" }}>
        {product?.descripcion ?? "—"}
      </TableCell>
      <TableCell sx={{ fontSize: "0.75rem" }}>
        {product?.nro_serie ?? "-"}
      </TableCell>
      <TableCell>{product?.tipo.nombre}</TableCell>
      <TableCell>
        <Chip
          size="small"
          label={product.es_accesorio ? "Si" : "No"}
          color={product.es_accesorio ? "success" : "error"}
          variant={"outlined"}
        />
      </TableCell>
      <TableCell>
        <Chip
          size="small"
          label={product.esta_activo ? "Si" : "No"}
          color={product.esta_activo ? "success" : "error"}
          variant={"outlined"}
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
          zIndex: 10,
          boxShadow: `-5px 0 5px -5px rgba(0,0,0,0.2)`,
        }}
      >
        <IconButton size="small" onClick={() => onViewDetails?.(product.id)}>
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onEdit?.(product.id)}>
          <Edit fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
