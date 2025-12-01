import { TableRow, TableCell, Chip, IconButton } from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";

export default function ItemTableRow({ item, onEdit, onViewDetails }) {
  const vigencia =
    item.fecha_inicio_vigencia || item.fecha_fin_vigencia
      ? `${(item.fecha_inicio_vigencia || "").slice(0, 10)} → ${(
          item.fecha_fin_vigencia || ""
        ).slice(0, 10)}`
      : "—";

  return (
    <TableRow hover>
      <TableCell>{item.codigo ?? "—"}</TableCell>
      <TableCell>{item.descripcion ?? item.descripcion_corta ?? "—"}</TableCell>
      <TableCell>{item?.tipo_catalogo?.nombre_catalogo ?? "—"}</TableCell>
      <TableCell>{vigencia}</TableCell>
      <TableCell>
        <Chip
          size="small"
          label={item.esta_activo ? "Sí" : "No"}
          color={item.esta_activo ? "success" : "default"}
          variant={item.esta_activo ? "filled" : "outlined"}
        />
      </TableCell>
      <TableCell>{(item.fecha_creacion || "").slice(0, 10) || "—"}</TableCell>
      <TableCell>
        {(item.fecha_modificacion || "").slice(0, 10) || "—"}
      </TableCell>

      <TableCell>
        <IconButton size="small" onClick={() => onViewDetails?.(item)}>
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onEdit?.(item)}>
          <Edit fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
