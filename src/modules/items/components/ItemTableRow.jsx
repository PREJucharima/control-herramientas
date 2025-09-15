import { useCallback } from "react";
import { Checkbox, TableRow, TableCell, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

export default function ItemTableRow({
  item,
  isSelected,
  handleSelectRow,
  onEdit,
  onDelete,
}) {
  // const [menuOpen, setMenuOpen] = useState(false);
  const handleCheck = useCallback(
    (e) => handleSelectRow(e, item.id),
    [handleSelectRow, item.id]
  );

  const vigencia =
    item.fecha_inicio_vigencia || item.fecha_fin_vigencia
      ? `${(item.fecha_inicio_vigencia || "").slice(0, 10)} → ${(
          item.fecha_fin_vigencia || ""
        ).slice(0, 10)}`
      : "—";

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
        <IconButton size="small" onClick={() => onEdit?.(item)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete?.(item)}>
          <DeleteOutline fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
