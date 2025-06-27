import { Drawer, Box, List } from "@mui/material";
import { useUiStore } from "@/core/states/uiStore";
import { useAuthStore } from "@/auth/states/authStore";
import { MenuList } from "./MenuList";

export const SideBar = ({ drawerWidth = 240, data = [] }) => {
  const { isDrawerOpen, onCloseDrawer } = useUiStore();
  const logout = useAuthStore((state) => state.logout);

  console.log(data);

  return (
    <Drawer
      component="div"
      variant={isDrawerOpen ? "temporary" : "permanent"}
      open={true}
      anchor="left"
      transitionDuration={{
        enter: 500,
        exit: 500,
      }}
      onClose={onCloseDrawer}
      sx={{
        width: { sm: drawerWidth },

        '& .MuiDrawer-paper': {
          backgroundColor: 'primary.main',
          width: { sm: drawerWidth },
          height: '100vh',
          flexShrink: { sm: 0 },
          padding: '20px',
          flexDirection: 'column',
          gap: '5px',
        },

        display: {
          xs: isDrawerOpen ? 'block' : 'none',
          sm: 'flex',
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Box sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        <img src="/logo-precision-white-2.svg" alt="Logo" />
      </Box>

      <Box sx={{ color: "white" }} component="nav">
        <List>
          <MenuList items={data} />
        </List>
        <List>
          <MenuList
            items={[
              { nombre: "Cerrar Sesión", icono: "logout", onClick: logout },
            ]}
          />
        </List>
      </Box>
    </Drawer>
  );
};
