import { memo, useMemo } from "react";
import { useNavigate } from "react-router";

import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { ObservationCard } from "./ObservationCard";

function ObservationCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ mb: 1.5, borderRadius: 2, px: 2, py: 1.5 }}>
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Skeleton variant="circular" width={36} height={36} animation="wave" />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="30%" height={18} animation="wave" />
          <Skeleton variant="text" width="18%" height={14} animation="wave" />
        </Box>

        <Stack direction="row" spacing={1}>
          {[...Array(2)].map((_, i) => (
            <IconButton key={i} size="small" disabled>
              <Skeleton variant="circular" width={22} height={22} />
            </IconButton>
          ))}
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
        {[80, 160, 140, 110].map((w, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            width={w}
            height={26}
            animation="wave"
            sx={{ borderRadius: 5 }}
          />
        ))}
      </Stack>

      <Box sx={{ mt: 1 }}>
        <Skeleton variant="text" height={16} animation="wave" />
        <Skeleton variant="text" width="80%" height={16} animation="wave" />
      </Box>
    </Card>
  );
}

function ObservationListBase({
  items,
  isLoading,
  error,
  emptyText = "No hay observaciones aún.",
  showHidden = true,
  onEdit,
  onToggleActive,
}) {
  const navigate = useNavigate();

  // Mostrar todo si showHidden=true; si no, solo activas
  const data = useMemo(
    () => (items ?? []).filter((it) => showHidden || it.esta_activo),
    [items, showHidden]
  );

  if (isLoading) {
    return <ObservationCardSkeleton />;
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
      {data.map((observation) => (
        <ObservationCard
          key={observation.id}
          observation={observation}
          onEdit={() => onEdit?.(observation.id)}
          onToggleActive={onToggleActive}
        />
      ))}
    </Box>
  );
}

export const ObservationList = memo(ObservationListBase);
