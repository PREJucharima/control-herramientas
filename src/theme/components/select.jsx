export const Select = () => {
  return {
    styleOverrides: {
      root: {
        "&.Mui-disabled": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "gray",
          },
          "& .MuiSvgIcon-root": {
            color: "gray",
          },
        },
        "& .MuiSelect-select.Mui-disabled": {
          color: "gray",
          WebkitTextFillColor: "gray",
          cursor: "not-allowed",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "gray",
        },
        "& .MuiSvgIcon-root": {
          color: "gray",
        },
      },
    },
  };
};
