import { Button, Container } from "@mui/material";
import { googleLogout } from "@react-oauth/google";
import { Navigate, useNavigate } from "react-router";
import { useAuthStore } from "@/auth/states/authStore";
import { RootLayout } from "@/core/layout/RootLayout";

export const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  // const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  console.log({ user });
  if (!user) return <Navigate to="/auth/login" />;

  const handleLogout = () => {
    googleLogout();
    logout();
    navigate("/auth/login");
  };

  return (
    <RootLayout>
      <Container>
        <h1>
          Bienvenido {user.nombre_usuario} {user.apellido_usuario}
        </h1>
        <Button variant="contained" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Container>
    </RootLayout>
  );
};
