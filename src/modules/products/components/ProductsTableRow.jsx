import { useState } from "react";

import dayjs from "dayjs";
import { MoreHoriz } from "@mui/icons-material";
import { TableRow, TableCell, Chip, IconButton } from "@mui/material";

import RowActionsMenu from "./RowActionsMenu";

export default function ProductsTableRow({ product, onEdit, onViewDetails }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);

  const openMenu = (e) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };
  const closeMenu = () => setMenuAnchor(null);

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
        <IconButton
          size="small"
          onClick={openMenu}
          aria-label="mas-acciones"
          aria-controls={menuOpen ? `row-menu-${product.id}` : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
        >
          <MoreHoriz fontSize="small" />
        </IconButton>

        <RowActionsMenu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={closeMenu}
          onViewDetails={() => onViewDetails?.(product.id)}
          onEdit={() => onEdit?.(product.id)}
        />
      </TableCell>
    </TableRow>
  );
}
