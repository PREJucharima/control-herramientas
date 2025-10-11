import ExpandMore from "@mui/icons-material/ExpandMore";

export const Autocomplete = (theme) => {
  return {
    defaultProps: {
      popupIcon: <ExpandMore />,
      slotProps: {
        paper: {
          sx: {
            marginTop: 1,
            borderRadius: 2,
          },
        },
      },
    },
    styleOverrides: {
      root: {
        // Label del TextField usado por Autocomplete
        "& .MuiInputLabel-root.Mui-disabled": {
          color: theme.palette.text.disabled,
          opacity: 1, // evita el “apagado” extra
        },
        // Texto del input (Chrome respeta -webkit-text-fill-color)
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: theme.palette.text.disabled,
        },
        // Borde del OutlinedInput cuando está disabled
        "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
          {
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.25)"
                : "rgba(0,0,0,0.23)",
          },
        // Iconos (flecha/clear) deshabilitados
        "& .MuiSvgIcon-root.Mui-disabled": {
          color: theme.palette.action.disabled,
        },
      },
      option: {
        padding: 10,
        fontSize: 14,
        borderRadius: 8,
        marginInline: 10,
      },
      tag: {
        maxWidth: 130,
      },
      colorSecondary: { color: theme.palette.grey[700] },
    },
  };
};
