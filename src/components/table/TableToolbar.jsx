import { Tooltip, Toolbar, IconButton, Typography } from "@mui/material";
import Delete from "@/icons/Delete";

export default function TableToolbar({ selected, handleDeleteRows }) {
  return (
    <Toolbar
      sx={{
        backgroundColor: "action.selected",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          flex: "1 1 100%",
        }}
      >
        {selected} {selected.length > 1 ? "seleccionados" : "seleccionado"}
      </Typography>

      <Tooltip title="Eliminar los seleccionado(s)">
        <IconButton onClick={handleDeleteRows} color="error">
          <Delete />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}
