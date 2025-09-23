import { use, useMemo } from "react";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { PropTypes } from "prop-types";

import { SettingsContext } from "@/contexts/SettingsContext";
import { createCustomTheme } from ".";

export const AppTheme = ({ children }) => {
  const { settings } = use(SettingsContext);
  const theme = useMemo(() => createCustomTheme(settings), [settings]);

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
