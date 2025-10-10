import { Edit, Visibility } from "@mui/icons-material";
import { TableRow, TableCell, Chip, IconButton } from "@mui/material";
import dayjs from "dayjs";

export default function ProductsTableRow({ product, onEdit, onViewDetails }) {
  const dateFormat = (dateStr) => {
    return dayjs(dateStr).format("DD/MM/YYYY");
  };

  const fechaCreacion = dateFormat(product.fecha_creacion || "");
  const fechaModificacion = dateFormat(product.fecha_modificacion || "");

  return (
    <TableRow hover>
      <TableCell sx={{ paddingLeft: 2 }}>{product?.codigo ?? "—"}</TableCell>
      <TableCell>{product?.estado_producto.descripcion ?? "—"}</TableCell>
      <TableCell>{product?.descripcion ?? "—"}</TableCell>
      <TableCell>{product?.nro_serie ?? "-"}</TableCell>
      <TableCell>{product?.tipo.descripcion}</TableCell>
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
      <TableCell>{product?.empresa.nombre ?? "—"}</TableCell>
      <TableCell>{product?.sucursal.nombre ?? "—"}</TableCell>
      <TableCell>{product?.categoria.nombre ?? "—"}</TableCell>
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
