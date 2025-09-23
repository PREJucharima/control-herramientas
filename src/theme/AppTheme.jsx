import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { PropTypes } from "prop-types";

import { createCustomTheme } from ".";

const settings = {
  theme: "light", // 'light' or 'dark'
};

export const AppTheme = ({ children }) => {
  const theme = createCustomTheme(settings);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

AppTheme.propTypes = {
  children: PropTypes.node,
};
