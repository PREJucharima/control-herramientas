import PropTypes from "prop-types";
import { Grid, Typography } from "@mui/material";

export const AuthLayout = ({ children }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "primary.main", padding: 4 }}
    >
      <Grid
        item
        xs={3}
        sx={{
          width: { sm: 450 },
          backgroundColor: "#fff",
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <img
          src="/logo_precision.png"
          alt="Logo PRECISION"
          width={120}
          style={{ marginBottom: 24 }}
        />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#0a1a28",
            mb: 2,
          }}
        >
          Control de Herramientas
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
          Inicia sesión con tu cuenta de Google corporativa <strong>PRECISION</strong> para continuar.
        </Typography>

        {children}
      </Grid>
    </Grid>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
};