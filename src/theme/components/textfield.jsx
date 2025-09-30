export const TextField = (theme) => ({
  styleOverrides: {
    root: {
      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: theme.palette.text.disabled,
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
