import { AuthLayout } from "../layout/AuthLayout";
import { Button, Grid } from "@mui/material";

export const LoginPage = () => {
  const onSubmit = () => {
    console.log("Inicio de sesión exitoso");
  };

  return (
    <AuthLayout>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          {/* Error Message */}
          {/* <Grid item xs={12} display={errorMessage ? "" : "none"}>
              <Alert severity="error">{errorMessage}</Alert>
            </Grid> */}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Iniciar Sesión con Google
            <img
              src="/google.svg"
              alt="google-logo"
              width={20}
              style={{ marginRight: "8px" }}
            />
          </Button>
        </Grid>
      </form>
    </AuthLayout>
  );
};