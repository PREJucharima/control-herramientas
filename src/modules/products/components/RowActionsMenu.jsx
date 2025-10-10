import { useNavigate } from "react-router";

import {
  Menu,
  MenuItem,
  MenuList,
  ListItemIcon,
  Divider,
  styled,
} from "@mui/material";
import {
  Visibility,
  Edit,
  History,
  KeyboardAltOutlined,
  Feed,
} from "@mui/icons-material";

const PrettyItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 10,
  margin: "0px 4px",
  padding: "8px 12px",
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
}) {
  const navigate = useNavigate();

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
      <MenuList sx={{ m: 0, p: 0, minWidth: 200 }}>
        <PrettyItem onClick={handleView}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <Text>Ver detalle</Text>
        </PrettyItem>

        <Divider />

        <PrettyItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <Text>Editar producto</Text>
        </PrettyItem>

        <Divider />

        <PrettyItem onClick={() => alert("Ver accesorios")}>
          <ListItemIcon>
            <KeyboardAltOutlined fontSize="small" />
          </ListItemIcon>
          <Text>Ver accesorios</Text>
        </PrettyItem>

        <Divider />

        <PrettyItem onClick={() => alert("Ver observaciones")}>
          <ListItemIcon>
            <Feed fontSize="small" />
          </ListItemIcon>
          <Text>Ver observaciones</Text>
        </PrettyItem>

        <Divider />

        <PrettyItem onClick={() => navigate("/catalogos/historial")}>
          <ListItemIcon>
            <History fontSize="small" />
          </ListItemIcon>
          <Text>Ver historial</Text>
        </PrettyItem>
      </MenuList>
    </Menu>
  );
}
