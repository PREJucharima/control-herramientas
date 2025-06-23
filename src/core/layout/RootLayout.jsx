import PropTypes from "prop-types";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { Box, Container } from "@mui/material";
import { getNavigation } from "@/services/getNavigation";
import { useAuthStore } from "@/auth/states/authStore";
import { Header } from "@/components/header/Header";
import { useNavigationStore } from "../states/navigationStore";
import { SideBar } from "../../components/sidebar/Sidebar";

const drawerWidth = 300;

export const RootLayout = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const { menus } = useNavigationStore();
  const setMenus = useNavigationStore((state) => state.setMenus);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const data = await getNavigation({ token, rol_id: user.rol_id });
        setMenus(data);
      } catch (error) {
        console.error("Error cargando menús:", error);
      }
    };

    if (user && token) fetchNavigation();
  }, [user, token, setMenus]);

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <Box sx={{ display: "flex" }}>
      <Header drawerWidth={drawerWidth} />
      <SideBar drawerWidth={drawerWidth} data={menus?.value?.menus || []} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "100px",
          width: {
            xs: "100%",
            sm: `calc(100% - ${drawerWidth}px)`,
          },
        }}
      >
        <Container>{children}</Container>
      </Box>
    </Box>
  );
};

RootLayout.propTypes = {
  children: PropTypes.node,
};
