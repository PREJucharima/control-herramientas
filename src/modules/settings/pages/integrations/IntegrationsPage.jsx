import { Grid } from "@mui/material";
import SynchronizeCard from "./components/SynchronizeCard";
import { integrationsEmployees } from "../../services/integrations/employeesBUK";
import { integrationsCostCenters } from "../../services/integrations/centroDeCostos";

export default function IntegrationsPage() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 12 }}>
        <SynchronizeCard
          title="Sincronización de Empleados"
          description="Este proceso actualiza la lista de empleados desde BUK. Haz clic en el botón para iniciar la sincronización manual."
          onSync={integrationsEmployees}
          storageKey="employees"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 12 }}>
        <SynchronizeCard
          title="Sincronización de Centros de Costos"
          description="Este proceso actualiza los centros de costos desde BUK para mantener la información alineada."
          onSync={integrationsCostCenters}
          storageKey="costCenters"
        />
      </Grid>
    </Grid>
  );
}
