import { useMemo, useState, useCallback } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  CommentSharp,
} from "@mui/icons-material";

import { useAuthStore } from "@/features/auth/states/authStore";
import { ObservationForm, ObservationList } from "../observations/components";
import { createObservation } from "../observations/services/createObservation";
import { updateObservationById } from "../observations/services/updateObservationById";
import { partialUpdateObservation } from "../observations/services/partialUpdateObservation";
import { useObservations } from "../observations/hooks/useObservations";
import { useObservationById } from "../observations/hooks/useObservationById";

export default function ProductObservationsDialog({
  open,
  onClose,
  productCode,
}) {
  const user = useAuthStore((state) => state.user);
  const userCompany = user?.profile?.sucursal_principal?.empresa;

  const { observations, isLoading, error, refetch } =
    useObservations(productCode);

  const [showHidden, setShowHidden] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Carga solo cuando hay edición
  const {
    observation: editingObs,
    loading: loadingEdit,
    // error: errorEdit,
  } = useObservationById(productCode, editingId, {
    enabled: editingId != null,
  });

  const items = useMemo(() => observations ?? [], [observations]);

  const counts = useMemo(() => {
    const active = items.filter((i) => i.esta_activo).length;
    return { active, hidden: items.length - active };
  }, [items]);

  const visibleItems = useMemo(
    () => (showHidden ? items : items.filter((i) => i.esta_activo)),
    [items, showHidden]
  );

  const onRefresh = useCallback(() => {
    refetch?.();
  }, [refetch]);

  const handleSubmit = async (payload) => {
    try {
      if (editingId) {
        // EDITAR
        await updateObservationById(productCode, editingId, payload);
        setEditingId(null);
      } else {
        // CREAR
        await createObservation(productCode, payload);
      }
      onRefresh();
    } catch (e) {
      console.error("Error guardando observación:", e);
    }
  };

  const handleToggleActive = async (id, next) => {
    try {
      await partialUpdateObservation(productCode, id, { esta_activo: next });
      onRefresh();
    } catch (e) {
      console.error("Error al cambiar visibilidad:", e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}
    >
      <DialogTitle
        sx={{
          px: 2.5,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <CommentSharp />
        <Typography variant="subtitle1" component="span" fontWeight={700}>
          Observaciones{items?.length ? ` (${items.length})` : ""}
        </Typography>

        {editingId && (
          <Chip
            size="small"
            color="primary"
            variant="outlined"
            label={`Editando #${editingId}`}
            onDelete={() => setEditingId(null)}
            sx={{ ml: 1 }}
          />
        )}

        <Box flex={1} />

        <Tooltip title="Actualizar">
          <span>
            <Button
              size="small"
              variant="text"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              disabled={isLoading}
            >
              Actualizar
            </Button>
          </span>
        </Tooltip>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: "background.default" }}>
        {/* GRID: izquierda form (sticky por dentro), derecha lista (scroll) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(320px, 36%) minmax(0,1fr)",
            },
            columnGap: { xs: 0, md: 2 },
            height: { xs: "auto", md: "72vh" },
            alignItems: "stretch",
          }}
        >
          {/* Columna izquierda: FORM */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              borderRight: { md: "1px solid" },
              borderColor: { md: "divider" },
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <ObservationForm
              productCode={productCode}
              defaultCompany={userCompany}
              onSubmit={handleSubmit}
              // Props de edición
              isEditing={!!editingId}
              editingData={editingObs}
              loadingEditing={loadingEdit}
              onCancelEdit={() => setEditingId(null)}
            />
          </Box>

          {/* Columna derecha: LISTA */}
          <Box sx={{ p: 2, pt: 1, overflow: "auto" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={showHidden}
                      onChange={(e) => setShowHidden(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Mostrar ocultos"
                />
                <Chip
                  label={`Activas: ${counts.active}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Ocultas: ${counts.hidden}`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Stack>

            <ObservationList
              productCode={productCode}
              items={visibleItems}
              isLoading={isLoading}
              error={error}
              onEdit={(id) => setEditingId(id)}
              onToggleActive={handleToggleActive}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
