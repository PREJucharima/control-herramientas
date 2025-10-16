import { memo, useMemo } from "react";
import { Alert, Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { ObservationCard } from "./ObservationCard";
import { partialUpdateObservation } from "../services/partialUpdateObservation";

function ObservationListBase({
  items,
  productCode,
  isLoading,
  error,
  emptyText = "No hay observaciones aún.",
  showHidden = true, // ← NUEVO: viene del diálogo
  onEdit, // ← NUEVO: reenvía al card
}) {
  const navigate = useNavigate();

  // Mostrar todo si showHidden=true; si no, solo activas
  const data = useMemo(
    () => (items ?? []).filter((it) => showHidden || it.esta_activo),
    [items, showHidden]
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Stack key={i} direction="row" spacing={1.5} sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" />
            </Box>
          </Stack>
        ))}
      </Box>
    );
  }

  if (error && !isLoading) {
    return (
      <Alert
        severity="error"
        sx={{ borderRadius: 2, mb: 1 }}
        action={
          <Button
            variant="text"
            color="inherit"
            size="small"
            onClick={() => navigate(0)}
          >
            Reintentar
          </Button>
        }
      >
        Error al cargar las observaciones del producto.
      </Alert>
    );
  }

  if (!data.length) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ p: 3, textAlign: "center" }}
      >
        {emptyText}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      {data.map((it) => (
        <ObservationCard
          key={it.id}
          item={it}
          onEdit={() => onEdit?.(it.id)} // ← reenvía id
          onToggleActive={async (id, next) => {
            await partialUpdateObservation(productCode, id, {
              esta_activo: next,
            });
            // ideal: invalidar cache / refetch aquí (o subir estado al padre)
          }}
        />
      ))}
    </Box>
  );
}

export const ObservationList = memo(ObservationListBase);
