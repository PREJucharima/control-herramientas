// import { useNavigate } from "react-router";

import { Button, styled, TextField } from "@mui/material";
import { Add, Search } from "@mui/icons-material";

import { FlexBetween } from "@/components/ui/flexbox";

const SearchTextField = styled(TextField)({
  maxWidth: 400,
  width: "100%",
});

export default function SearchArea({ value = "", onChange }) {
  // const navigate = useNavigate();

  return (
    <FlexBetween flexWrap="wrap" gap={2} my={3}>
      <SearchTextField
        value={value}
        onChange={onChange}
        placeholder="Buscar..."
        slotProps={{
          input: {
            startAdornment: <Search />,
          },
        }}
      />

      {/* <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => navigate("/maestros/empleados/nuevo")}
      >
        Agregar empleado
      </Button> */}
    </FlexBetween>
  );
}
