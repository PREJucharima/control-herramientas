import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  styled,
  MenuList,
} from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Add from "@mui/icons-material/Add";
import CloudUpload from "@mui/icons-material/CloudUpload";

const PrettyItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 10,
  margin: "2px 8px",
  padding: "8px 10px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Text = styled("p")(() => ({
  fontSize: "13",
  display: "block",
}));

export default function ActionsMenu({
  onAdd,
  onBulk,
  addLabel = "Agregar producto",
  bulkLabel = "Carga masiva",
  size = "medium",
  variant = "contained",
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const close = () => setAnchorEl(null);
  const handleAdd = () => {
    onAdd?.();
    close();
  };
  const handleBulk = () => {
    onBulk?.();
    close();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        endIcon={<KeyboardArrowDown />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Acciones
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList sx={{ m: 0, p: 0 }}>
          <PrettyItem onClick={handleAdd}>
            <ListItemIcon>
              <Add fontSize="small" />
            </ListItemIcon>
            <Text>{addLabel}</Text>
          </PrettyItem>

          <Divider />

          <PrettyItem onClick={handleBulk}>
            <ListItemIcon>
              <CloudUpload fontSize="small" />
            </ListItemIcon>
            <Text>{bulkLabel}</Text>
          </PrettyItem>
        </MenuList>
      </Menu>
    </>
  );
}
