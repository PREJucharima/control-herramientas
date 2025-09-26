import { Grid } from "@mui/material";
import { integrationsEmployees } from "../../../settings/services/integrations/employees";
import { integrationsCostCenters } from "../../../settings/services/integrations/centroDeCostos";
import SynchronizeCard from "./components/SynchronizeCard";

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
          description="Este proceso actualiza los centros de costos desde BUK para mantener la información financiera alineada."
          onSync={integrationsCostCenters}
          storageKey="costCenters"
        />
      </Grid>
    </Grid>
  );
}
