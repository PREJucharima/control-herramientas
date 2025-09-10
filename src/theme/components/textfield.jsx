export const TextField = (theme) => ({
  styleOverrides: {
    root: {
      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: theme.palette.grey[500],
      },
    },
  },
});