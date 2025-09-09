import { AuthLayout } from "../layout";
import { Button, Grid } from "@mui/material";
import { CustomSnackbar } from "@/components/custom-snackbar";
import { fetchGoogleUserinfo } from "../services/googleService";
import { loginWithEmail } from "../services/authService";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../states/authStore";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useNavigate } from "react-router";

const LOGO_PATH = "/static/logo/google.svg";
const REQUIRED_DOMAIN = "@precision.tech";

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuthData = useAuthStore((s) => s.setAuthData);
  const [pending, setPending] = useState(false);

  const { snackbar, showSnackbar, handleClose } = useSnackbar();

  const login = useGoogleLogin({
    scope: "openid email profile",
    prompt: "select_account",
    onSuccess: async ({ access_token }) => {
      try {
        setPending(true);
        const profile = await fetchGoogleUserinfo(access_token);
        const email = profile?.email;
        const verified = profile?.email_verified;

        if (!verified || !email?.endsWith(REQUIRED_DOMAIN)) {
          showSnackbar(
            "Solo se permiten correos corporativos verificados",
            "warning"
          );
          return;
        }

        const auth = await loginWithEmail(email);
        setAuthData(auth);
        navigate("/home");
      } catch (e) {
        showSnackbar("Acceso denegado!", "error");
        console.error("Error al autenticar", e);
      } finally {
        setPending(false);
      }
    },
    onError: () => console.log("Error al iniciar sesión!"),
  });

  return (
    <AuthLayout>
      <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
        <Button
          fullWidth
          type="button"
          variant="contained"
          disabled={pending}
          endIcon={<img src={LOGO_PATH} width={20} height={20} alt="Google" />}
          sx={{
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: { xs: 1.25, md: 1.5 },
            fontSize: { xs: "0.95rem", md: "1rem" },
          }}
          onClick={() => login()}
        >
          {pending ? "Conectando..." : "Iniciar sesión con Google"}
        </Button>
      </Grid>

      <CustomSnackbar
        {...snackbar}
        onClose={handleClose}
        position={{ vertical: "top", horizontal: "center" }}
      />
    </AuthLayout>
  );
};
