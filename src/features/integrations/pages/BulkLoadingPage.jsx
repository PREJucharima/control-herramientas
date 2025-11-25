import { Container, Grid } from "@mui/material";

import { BulkLoadCard } from "../components/BulkLoadCard";
import { bulkLoadProducts } from "../services/bulkLoading";

export default function BulkLoadingPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <BulkLoadCard
            title="Carga masiva de productos"
            description="Este proceso dispara la carga masiva interna en el servidor. Se procesarán los datos disponibles en la fuente de origen."
            onProcess={bulkLoadProducts}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
