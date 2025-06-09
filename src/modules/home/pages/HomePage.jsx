import { googleLogout } from '@react-oauth/google';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../auth/states/authStore';
import { Navigate } from "react-router";

export const HomePage = () => {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    logout();
    navigate('/auth/login');
  };

  console.log(user)
  if (!user) return <Navigate to="/auth/login" />;

  return (
    <Container>
      <h1>Bienvenido {user.nombre_usuario} {user.apellido_usuario}</h1>
      <Button variant="contained" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </Container>
  );
};
