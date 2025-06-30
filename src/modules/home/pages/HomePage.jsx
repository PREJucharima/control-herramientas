import { Button, Container } from "@mui/material";
import { Navigate } from "react-router";
import { useAuthStore } from "@/auth/states/authStore";
import { useAuth } from "@/auth/hooks/useAuth";

export const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const { handleLogout } = useAuth();

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <Container>
      <h1>
        Bienvenido {user.nombre_usuario} {user.apellido_usuario}
      </h1>
      <Button variant="contained" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </Container>
  );
};
