import { Menu, MenuItem, MenuList, ListItemIcon, styled } from "@mui/material";
import {
  Visibility,
  Edit,
  History,
  KeyboardAltOutlined,
  Feed,
} from "@mui/icons-material";

const PrettyItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 10,
  margin: "4px 6px",
  padding: "10px 12px",
  "&:hover": { backgroundColor: theme.palette.action.hover },
}));

const Text = styled("p")(() => ({
  fontSize: "13px",
  display: "block",
}));

export default function RowActionsMenu({
  anchorEl,
  open,
  onClose,
  onViewDetails,
  onEdit,
  onViewObservations,
  onViewHistory,
}) {
  const handleView = () => {
    onViewDetails?.();
    onClose?.();
  };
  const handleEdit = () => {
    onEdit?.();
    onClose?.();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
    >
      <MenuList sx={{ m: 0, p: 0, minWidth: 220 }}>
        <PrettyItem onClick={handleView}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <Text>Ver detalle</Text>
        </PrettyItem>

        <PrettyItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <Text>Editar producto</Text>
        </PrettyItem>

        <PrettyItem onClick={() => alert("Ver accesorios")}>
          <ListItemIcon>
            <KeyboardAltOutlined fontSize="small" />
          </ListItemIcon>
          <Text>Ver accesorios</Text>
        </PrettyItem>

        <PrettyItem onClick={onViewObservations}>
          <ListItemIcon>
            <Feed fontSize="small" />
          </ListItemIcon>
          <Text>Ver observaciones</Text>
        </PrettyItem>

        <PrettyItem onClick={onViewHistory}>
          <ListItemIcon>
            <History fontSize="small" />
          </ListItemIcon>
          <Text>Ver historial</Text>
        </PrettyItem>
      </MenuList>
    </Menu>
  );
}
