import { useState } from "react";

import { Chip, Popover, Stack, Button, styled } from "@mui/material";

export const CustomChipFilter = styled(Chip)(() => ({
  height: "2.7rem",
  borderRadius: 5,
  border: "1px solid ",
  borderStyle: "dotted",
}));

export function FilterPill({ label, active, onClear, children, chipProps }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <CustomChipFilter
        clickable
        variant={"outlined"}
        color={active ? "primary" : "default"}
        label={label}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        onDelete={active ? onClear : undefined}
        {...chipProps}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { p: 2, width: 320, borderRadius: 2 } } }}
      >
        <Stack gap={2}>
          {typeof children === "function"
            ? children(() => setAnchorEl(null))
            : children}
          <Button variant="outlined" onClick={() => setAnchorEl(null)}>
            Cerrar
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
