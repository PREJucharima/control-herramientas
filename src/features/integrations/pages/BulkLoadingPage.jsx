import { Container, Grid } from "@mui/material";

import { SynchronizeCard } from "../components/SynchronizeCard";

export default function BulkLoadingPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <SynchronizeCard
            title="Carga masiva de productos"
            description="Este proceso permite cargar múltiples productos desde un archivo CSV."
            onSync={() => {}}
            storageKey="massiveProducts"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
