import { googleLogout } from '@react-oauth/google';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../auth/states/authStore';
import { Navigate } from "react-router";
import { RootLayout } from '../../core/layout/RootLayout';
import { useEffect, useState } from 'react';
import { getNavigation } from '../services/getNavigation';

export const HomePage = () => {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();

  console.log({user, token})

  const handleLogout = () => {
    googleLogout();
    logout();
    navigate('/auth/login');
  };

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
  }, [user, token]); 

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <RootLayout>
      <Container>
        <h1>Bienvenido {user.nombre_usuario} {user.apellido_usuario}</h1>
        <pre>{JSON.stringify(menus, null, 2)}</pre>
        <Button variant="contained" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Container>
    </RootLayout>
  );
};
