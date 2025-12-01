import { useState } from "react";

import { MoreHoriz } from "@mui/icons-material";
import { TableRow, TableCell, Chip, IconButton } from "@mui/material";
import RowActionsMenu from "./RowActionsMenu";

export default function ContractsTableRow({ contract, onEdit, onViewDetails }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);

  console.log("contract", contract);

  const openMenu = (e) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };
  const closeMenu = () => setMenuAnchor(null);

  return (
    <TableRow hover>
      <TableCell sx={{ paddingLeft: 4 }}>
        {contract?.descripcion ?? "—"}
      </TableCell>
      <TableCell>{contract?.fecha_inicio_vigencia ?? "-"}</TableCell>
      <TableCell>{contract?.fecha_fin_vigencia ?? "-"}</TableCell>
      <TableCell>{contract?.empresa?.nombre ?? "—"}</TableCell>
      <TableCell>{contract?.sucursal?.nombre ?? "—"}</TableCell>
      <TableCell>{contract?.categoria?.nombre ?? "—"}</TableCell>
      <TableCell>
        <Chip
          size="small"
          label={contract?.esta_activo ? "Activo" : "Inactivo"}
          color={contract?.esta_activo ? "success" : "error"}
          variant={"outlined"}
        />
      </TableCell>

      <TableCell
        align="center"
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
          aria-controls={menuOpen ? `row-menu-${contract.id}` : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
        >
          <MoreHoriz fontSize="small" />
        </IconButton>

        <RowActionsMenu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={closeMenu}
          onViewDetails={() => onViewDetails?.(contract.id)}
          onEdit={() => onEdit?.(contract.id)}
        />
      </TableCell>
    </TableRow>
  );
}
