import { Toolbar, Typography, Button } from "@mui/material";
import { Sync } from "@mui/icons-material";

export default function TableToolbar({ selected, handleSyncRows }) {
  const count = selected.length;
  if (count === 0) return null;

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
        {selected} seleccionado(s)
      </Typography>

      <span>
        <Button
          onClick={handleSyncRows}
          disabled={count === 0}
          variant="text"
          color="primary"
          startIcon={<Sync />}
        >
          {count === 1 ? "Sincronizar" : "Sincronizar seleccionados"}
        </Button>
      </span>
    </Toolbar>
  );
}
