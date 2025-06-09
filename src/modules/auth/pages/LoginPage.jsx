import { AuthLayout } from "../layout";
import { Grid } from "@mui/material";
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from "../states/authStore";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const LoginPage = () => {
  const navigate = useNavigate()
  const setUserData = useAuthStore((state) => state.setUserData);

  const handleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const email = decoded.email;

    if (!email.endsWith('@precision.tech')) {
      alert('Solo correos corporativos');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/Autenticacion/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo_electronico: email }),
      });

      const data = await res.json();

      if (data.hasSucceeded && data.value?.token) {
        setUserData(data.value);
        navigate('/home');
      } else {
        alert('Acceso denegado');
      }

      console.log("Inicio de sesión exitoso", data);
    } catch (error) {
      console.log('Error al autenticar', error)
    }
  };

  // const login = useGoogleLogin({
  //   onSuccess: tokenResponse => console.log(tokenResponse),
  //   onError: () => {
  //     console.log('Login Failed');
  //   },
  // });

  return (
    <AuthLayout>
        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          {/* Error Message */}
          {/* <Grid item xs={12} display={errorMessage ? "" : "none"}>
              <Alert severity="error">{errorMessage}</Alert>
            </Grid> */}

          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
            width={400}
            theme="outline"
            size="large"
          />

          {/* <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => login()}
          >
            Iniciar Sesión con Google
            <img
              src="/google.svg"
              alt="google-logo"
              width={20}
              style={{ marginRight: "8px" }}
            />
          </Button> */}
        </Grid>
    </AuthLayout>
  );
};