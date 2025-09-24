import { Navigate } from "react-router";

import { Button, Container } from "@mui/material";

import { useAuth } from "@/auth/hooks/useAuth";
import { useAuthStore } from "@/auth/states/authStore";

const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const { handleLogout } = useAuth();

  if (!user) return <Navigate to="/auth/login" />;
  return (
    <Container>
      <h1>
        Bienvenido {user.first_name} {user.last_name}
      </h1>
      <Button variant="contained" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </Container>
  );
};

export default HomePage;
