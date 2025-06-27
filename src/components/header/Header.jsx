import { Menu } from "@mui/icons-material";
import {
  Avatar,
  Breadcrumbs,
  Container,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Toolbar,
} from "@mui/material";
import { FlexBox, FlexBetween } from "@/components/flexbox";
import { useUiStore } from "@/core/states/uiStore";
import { useAuthStore } from "@/auth/states/authStore";

export const Header = ({ drawerWidth = 240 }) => {
  const onOpenDrawer = useUiStore((state) => state.onOpenDrawer);
  const user = useAuthStore((state) => state.user);

  return (
    <FlexBox
      component="header"
      position="fixed"
      alignItems="center"
      sx={{
        height: { sm: "100px" },
        width: {
          xs: "100vw",
          sm: `calc(100% - ${drawerWidth}px)`,
        },
        ml: { sm: `${drawerWidth}px` },
        mt: { xs: "20px" },
        zIndex: 100,
        backgroundColor: "#ffffff",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <FlexBetween width="100%">
            <IconButton
              onClick={onOpenDrawer}
              sx={{ display: { xs: "block", sm: "none" } }}
            >
              <Menu />
            </IconButton>

            <FlexBox alignItems="center" gap={8} sx={{ flex: 1 }}>

              <Breadcrumbs aria-label="breadcrumb">
                <Typography color="inherit">{user.alcancesAccesibles[0]?.sucursal_nombre}</Typography>
                <Typography color="inherit">{user.alcancesAccesibles[0]?.empresa_nombre}</Typography>
              </Breadcrumbs>

              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar src={user.photoURL} />
                </ListItemAvatar>
                <ListItemText
                  sx={{ color: "black" }}
                  primary={`${user.nombre_usuario} ${user.apellido_usuario}`}
                  secondary={user.rol_nombre}
                />
              </ListItem>
            </FlexBox>
          </FlexBetween>
        </Toolbar>
      </Container>
    </FlexBox>
  );
};
