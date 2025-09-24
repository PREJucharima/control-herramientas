import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import { synchronizeEmployees } from "../../../settings/services/synchronizeEmployees";

export default function Synchronize() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncInfo, setLastSyncInfo] = useState(null);

  const handleSyncClick = async () => {
    setIsLoading(true);

    try {
      const syncResult = await synchronizeEmployees();

      setLastSyncInfo({
        date: new Date(),
        created: syncResult.creados,
        updated: syncResult.actualizados,
      });
    } catch (error) {
      console.error("Error al sincronizar:", error);
      setLastSyncInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Sincronización de Empleados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Este proceso actualiza la lista de empleados en el sistema importando
          los datos más recientes desde BUK. Haz clic en el botón para iniciar
          la sincronización manual.
        </Typography>

        {lastSyncInfo && (
          <Box mt={2} p={1.5} bgcolor={"success.light"} borderRadius={1}>
            <Typography variant="caption" display="block">
              Última sincronización: {lastSyncInfo.date.toLocaleString()}
            </Typography>
            <Typography variant="caption" display="block">
              (Creados: {lastSyncInfo.created}, Actualizados:{" "}
              {lastSyncInfo.updated})
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ padding: 2 }}>
        <Button
          onClick={handleSyncClick}
          loading={isLoading} // Controla el estado de carga del botón
          loadingPosition="start"
          startIcon={<SyncIcon />}
          variant="contained"
        >
          {isLoading ? "Sincronizando..." : "Sincronizar ahora"}
        </Button>
      </CardActions>
    </Card>
  );
}
