import {
  Button,
  InputAdornment,
  InputBase,
  Slide,
  styled,
} from "@mui/material";

import SearchIcon from "@/icons/SearchIcon";

const StyledRoot = styled("div")(({ theme }) => ({
  gap: 2,
  left: 0,
  top: -16,
  height: 60,
  zIndex: 9999,
  width: "100%",
  display: "flex",
  padding: "0 1rem",
  borderRadius: "4px",
  alignItems: "center",
  position: "absolute",
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.background.paper,
  ".search-icon": {
    color: theme.palette.grey[400],
  },
  ".input-field": {
    fontSize: 13,
    fontWeight: 500,
    flexGrow: 1,
  },
}));

export default function SearchBar({ open, handleClose }) {
  // SEARCH ICON IN INPUT BOX
  const INPUT_ADORNMENT = (
    <InputAdornment position="start">
      <SearchIcon className="search-icon" />
    </InputAdornment>
  );
  return (
    <Slide direction="down" in={open} mountOnEnter unmountOnExit>
      <StyledRoot>
        <InputBase
          fullWidth
          autoFocus
          placeholder="Buscar..."
          startAdornment={INPUT_ADORNMENT}
          className="input-field"
        />

        <Button variant="contained" onClick={handleClose}>
          Buscar
        </Button>
      </StyledRoot>
    </Slide>
  );
}
