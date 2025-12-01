import { Add } from "@mui/icons-material";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router";

const ContractListPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h6" fontWeight={700} noWrap>
        Contratos
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => navigate("/maestros/contratos/nuevo")}
        fullWidth={false}
      >
        Agregar contrato
      </Button>
    </Container>
  );
};

export default ContractListPage;
