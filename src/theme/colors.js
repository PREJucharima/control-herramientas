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
  25: "#F1FEF5",
  50: "#E3FDEB",
  100: "#CDFBDB",
  200: "#9DF7C2",
  300: "#6AE9AA",
  400: "#43D49A",
  500: "#11b886",
  600: "#0C9E80",
  700: "#088477",
  800: "#056A6A",
  900: "#035058",
  main: "#11b843ff",
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
  25: "#FEF6F8",
  50: "#FEF1F4",
  100: "#FDE8ED",
  200: "#FBD5DE",
  300: "#F7A6BA",
  400: "#F37795",
  500: "#EF4770",
  600: "#EB194C",
  700: "#C0113C",
  800: "#910D2D",
  900: "#63091F",
  main: "#EF4770",
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
  disabled: grey[200],
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
  info,
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
