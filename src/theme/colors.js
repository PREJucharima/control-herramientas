import { alpha } from "@mui/material/styles";

const grey = {
  25: "#F9FAFB",
  50: "#F6F7F8",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827",
};

export const primary = {
  25: "#e0fdf7",
  50: "#ccfbf1",
  100: "#99f6e4",
  200: "#5eead4",
  300: "#2dd4bf",
  400: "#14b8a6",
  500: "#10a191",
  600: "#0e9384",
  700: "#0c8376",
  800: "#0a7166",
  900: "#08594f",
  main: "#21E0B2",
};

export const success = {
  25: "#F2FCEE",
  50: "#E5F9DC",
  100: "#CEF5BC",
  200: "#ADF18D",
  300: "#8BEF5D",
  400: "#68EF2A",
  500: "#4AD808",
  600: "#3DB008",
  700: "#2F8A05",
  800: "#256D03",
  900: "#1B5002",
  main: "#4AD808FF",
};

export const warning = {
  25: "#FFFCF5",
  50: "#FFF8E6",
  100: "#FFF8E6",
  200: "#FFEBB3",
  300: "#FEDE80",
  400: "#FED14D",
  500: "#FEBF06",
  600: "#DB7E24",
  700: "#B75F19",
  800: "#93440F",
  900: "#7A3109",
  main: "#FEBF06",
};

export const error = {
  25: "#FFF3F0",
  50: "#FEE7E1",
  100: "#FCD1C5",
  200: "#FAB19A",
  300: "#F77A5E",
  400: "#F25536",
  500: "#EC2E0C",
  600: "#C9260A",
  700: "#A31F08",
  800: "#7D1807",
  900: "#571105",
  main: "#EC2E0CFF",
};

export const secondary = { ...grey, main: "#F1F5F9" };

export const teal = {
  25: "#e0fdf7",
  50: "#ccfbf1",
  100: "#99f6e4",
  200: "#5eead4",
  300: "#2dd4bf",
  400: "#14b8a6",
  500: "#10a191",
  600: "#0e9384",
  700: "#0c8376",
  800: "#0a7166",
  900: "#08594f",
  main: "#21e0b2",
};

export const tertiary = {
  25: "#f1f3f4",
  50: "#e1e4e6",
  100: "#c2c7cb",
  200: "#a3aab0",
  300: "#657884",
  400: "#405360",
  500: "#2a3a45",
  600: "#1f2b34",
  700: "#141d23",
  800: "#0d151b",
  900: "#070e13",
  main: "#0a1a28",
};

export const info = {
  light: "#F4F4FF",
  main: "#0a1a28",
  dark: "#0C53B7",
};

// TEXT
export const textLight = {
  primary: grey[900],
  disabled: grey[400],
  secondary: grey[500],
};

export const textDark = {
  primary: "#ffffff",
  disabled: grey[200],
  secondary: grey[400],
};

// ACTION
export const actionLight = {
  focusOpacity: 0.12,
  hoverOpacity: 0.04,
  selected: grey[50],
  disabled: grey[200],
  disabledOpacity: 0.38,
  selectedOpacity: 0.08,
  activatedOpacity: 0.12,
  focus: alpha(grey[900], 0.12),
  hover: alpha(grey[900], 0.04),
  active: alpha(grey[900], 0.54),
  disabledBackground: alpha(grey[900], 0.12),
};

export const actionDark = {
  focusOpacity: 0.12,
  hoverOpacity: 0.04,
  selected: grey[700],
  disabledOpacity: 0.38,
  selectedOpacity: 0.16,
  activatedOpacity: 0.24,
  focus: alpha(grey[100], 0.12),
  hover: alpha(grey[100], 0.04),
  active: alpha(grey[100], 0.54),
  disabledBackground: alpha(grey[100], 0.12),
};

// BASE
const basePalette = {
  grey,
  // info,
  error,
  primary,
  success,
  warning,
  secondary,
  teal,
  tertiary,
};

export const lightPalette = {
  ...basePalette,
  mode: "light",
  primary: { ...tertiary },
  text: textLight,
  divider: grey[200],
  action: actionLight,
  background: {
    paper: "#ffffff",
    default: "rgb(244 244 244)",
  },
};

export const darkPalette = {
  ...basePalette,
  mode: "dark",
  text: textDark,
  divider: grey[700],
  action: actionDark,
  background: {
    paper: grey[800],
    default: grey[900],
  },
};
