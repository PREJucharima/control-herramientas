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
      variant={isDrawerOpen ? "temporary" : "permanent"}
      open
      anchor="left"
      onClose={onCloseDrawer}
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          backgroundColor: "primary.main",
          width: drawerWidth,
          padding: 2,
        },
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
