import { useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  PushPin as PushPinIcon,
  Send as SendIcon,
  CommentSharp,
} from "@mui/icons-material";

import { useAuthStore } from "@/auth/states/authStore";
import { ObservationForm } from "../observations/components";
import { createObservation } from "../observations/services/createObservation";
import { useObservations } from "../observations/hooks/useObservations";

export default function ProductObservationsDialog({
  open,
  onClose,
  productCode,
}) {
  const user = useAuthStore((state) => state.user);
  const userCompany = user?.profile?.sucursal_principal?.empresa;
  const {
    observations,
    isLoading: isObservationsLoading,
    // error: errorObservations,
  } = useObservations(productCode);

  const initials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const onRefresh = () => {};

  const items = useMemo(() => observations ?? [], [observations]);

  console.log("Observations in dialog:", observations);

  const handleSubmit = async (payload) => {
    try {
      await createObservation(productCode, payload);
      // addProduct(created);
      // navigate(`/catalogos/productos`);
    } catch (e) {
      console.error("Error creando un nuevo producto:", e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 2, overflow: "hidden" },
      }}
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
        <Typography variant="subtitle1" component={"h1"} fontWeight={700}>
          Observaciones
          {items?.length ? ` (${items.length})` : ""}
        </Typography>

        <Box flex={1} />

        <Tooltip title="Actualizar">
          <span>
            <Button
              size="small"
              variant="text"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              disabled={isObservationsLoading}
            >
              Actualizar
            </Button>
          </span>
        </Tooltip>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          bgcolor: "background.default",
        }}
      >
        {/* Caja de entrada */}
        <ObservationForm
          productCode={productCode}
          defaultCompany={userCompany}
          onSubmit={handleSubmit}
        />

        {/* Lista de observaciones */}
        <Box sx={{ maxHeight: "60vh", overflow: "auto" }}>
          {isObservationsLoading && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 3, textAlign: "center" }}
            >
              Cargando observaciones…
            </Typography>
          )}

          {!isObservationsLoading && items.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ p: 3, textAlign: "center" }}
            >
              No hay observaciones aún.
            </Typography>
          )}

          {!isObservationsLoading && items.length > 0 && (
            <List disablePadding>
              {items.map((it) => (
                <ListItem
                  key={it.id}
                  alignItems="flex-start"
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 36, height: 36 }}>
                      {initials(it.usuario_creacion)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        flexWrap="wrap"
                      >
                        <Typography variant="body2" fontWeight={700}>
                          {it.usuario_creacion}
                        </Typography>
                        {it.pinned && (
                          <Chip
                            size="small"
                            icon={<PushPinIcon sx={{ fontSize: 16 }} />}
                            label="Fijada"
                            variant="outlined"
                          />
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: "auto" }}
                        >
                          {it.fecha_creacion}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", mt: 0.25 }}
                      >
                        {it.observacion}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
