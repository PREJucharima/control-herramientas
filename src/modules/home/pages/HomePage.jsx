import { googleLogout } from '@react-oauth/google';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../auth/states/authStore';

export const HomePage = () => {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();      // cierra sesión de Google
    logout();            // borra estado local
    navigate('/auth/login'); // redirige al login
  };

  return (
    <Container>
      <h1>HomePage</h1>
      <Button variant="contained" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </Container>
  );
};
