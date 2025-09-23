import { createTheme } from "@mui/material/styles";

import { THEMES } from "@/utils/constants";
import componentsOverride from "./components";
import shadows from "./shadows";
import themesOptions from "./themeOptions";

import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/600.css";
import "@fontsource/public-sans/700.css";

const baseOptions = {
  direction: "ltr",
  typography: {
    fontFamily: "'Public Sans', sans-serif",
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    h1: {
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.5,
    },
    h2: {
      fontSize: 40,
      fontWeight: 700,
      lineHeight: 1.5,
    },
    h3: {
      fontSize: 36,
      fontWeight: 700,
      lineHeight: 1.5,
    },
    h4: {
      fontSize: 32,
      fontWeight: 600,
    },
    h5: {
      fontSize: 28,
      fontWeight: 600,
      lineHeight: 1,
    },
    h6: {
      fontSize: 18,
      fontWeight: 500,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
};

export function createCustomTheme(settings) {
  const themeOption =
    themesOptions[settings.theme] ?? themesOptions[THEMES.LIGHT];

  const theme = createTheme({
    ...baseOptions,
    ...themeOption,
  });

  theme.shadows = shadows(theme);
  theme.components = componentsOverride(theme);

  return theme;
}
