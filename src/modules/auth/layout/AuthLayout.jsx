import PropTypes from "prop-types";
import { Grid } from "@mui/material";

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
        className="box-shadow"
        xs={3}
        sx={{
          width: { sm: 450 },
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 2 }}
        >
          <img
            src="/logo_precision.png"
            alt="logo PRECISION"
            width={250}
            style={{ margin: "16px" }}
          />
        </Grid>

        {children}
      </Grid>
    </Grid>
  );
};

AuthLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};