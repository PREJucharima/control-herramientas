// Paquetes externos
import { useNavigate, useParams } from "react-router";

// MUI
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Add, Search } from "@mui/icons-material";

// Componentes internos
import FlexBetween from "@/components/flexbox/FlexBetween";

const SearchTextField = styled(TextField)({
  maxWidth: 400,
  width: "100%",
});

export default function SearchArea({ value = "", onChange }) {
  const navigate = useNavigate();
  const { codigo } = useParams();

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

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() =>
          navigate(`/catalogos/maestros/${encodeURIComponent(codigo)}/agregar`)
        }
      >
        Agregar item
      </Button>
    </FlexBetween>
  );
}
