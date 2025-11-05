export const TextField = (theme) => ({
  styleOverrides: {
    root: {
      "& .MuiInputLabel-root.Mui-disabled": {
        color: theme.palette.text.disabled,
        opacity: 1,
      },
      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: theme.palette.text.disabled,
      },
      "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
        {
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.25)"
              : "rgba(0,0,0,0.23)",
        },
      "& .MuiSvgIcon-root.Mui-disabled": {
        color: theme.palette.action.disabled,
      },
      '& input[type="search"]::-webkit-search-cancel-button, \
         input[type="search"]::-webkit-search-decoration, \
         input[type="search"]::-webkit-search-results-button, \
         input[type="search"]::-webkit-search-results-decoration': {
        WebkitAppearance: "none",
        appearance: "none",
        display: "none",
      },
    },
  },
});
