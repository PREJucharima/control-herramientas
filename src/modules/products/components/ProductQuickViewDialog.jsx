import { useMemo } from "react";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Close,
  ContentCopy,
  Inventory2,
  QrCode2,
  ConfirmationNumber,
  Description,
  Business,
  Store,
  Category,
  Checklist,
  Layers,
  Sell,
  DevicesOther,
} from "@mui/icons-material";

import { useFetchProductByCode } from "../hooks/useFetchProductByCode";

function formatDate(dateStr) {
  const d = dayjs(dateStr);
  return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : "—";
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    console.error("Error copiando al portapapeles:", e);
  }
}

const FieldRow = ({ label, value, icon, action }) => (
  <Stack direction="row" gap={1.25} alignItems="center">
    {icon}
    <Stack sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight={500}
          noWrap
          title={value ?? "—"}
          sx={{ minWidth: 0, flex: 1 }}
        >
          {value ?? "—"}
        </Typography>
        {action ?? null}
      </Stack>
    </Stack>
  </Stack>
);

export default function ProductQuickViewDialog({ open, id, onClose }) {
  const navigate = useNavigate();

  const { productDetail, isLoading, error } = useFetchProductByCode(id);
  const p = productDetail ?? null;

  console.log("ProductQuickViewDialog render", {
    id,
    product: p,
    loading: isLoading,
    error,
  });

  const statusChips = useMemo(() => {
    if (!p) return null;

    return (
      <Stack direction="row" gap={1} flexWrap="wrap">
        <Chip
          size="small"
          label={p.esta_activo ? "Activo" : "Inactivo"}
          color={p.esta_activo ? "success" : "default"}
          variant={p.esta_activo ? "filled" : "outlined"}
        />
        <Chip
          size="small"
          label={p.es_accesorio ? "Accesorio" : "No accesorio"}
          color={p.es_accesorio ? "info" : "default"}
          variant="outlined"
        />
        <Chip
          size="small"
          label={p.es_nuevo ? "Nuevo" : "Usado"}
          color={p.es_nuevo ? "primary" : "default"}
          variant="outlined"
        />
      </Stack>
    );
  }, [p]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="ver-producto"
    >
      <DialogTitle id="ver-producto" sx={{ py: 1.5 }}>
        <Stack direction="row" alignItems="center" gap={1.25}>
          <Inventory2 />
          <Typography fontWeight={700}>Producto</Typography>
          <Stack sx={{ flex: 1 }} />
          <IconButton aria-label="Cerrar" onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        {isLoading && (
          <Stack gap={2}>
            <Stack direction="row" gap={2} alignItems="center">
              <Skeleton variant="circular" width={56} height={56} />
              <Stack gap={0.75} sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Stack>
            </Stack>
            <Skeleton variant="rectangular" height={90} />
            <Skeleton variant="rectangular" height={110} />
          </Stack>
        )}

        {error && !isLoading && (
          <Alert
            severity="error"
            sx={{ borderRadius: 2, mb: 1 }}
            action={
              <Button color="inherit" size="small" onClick={() => navigate(0)}>
                Reintentar
              </Button>
            }
          >
            Error al cargar la información del producto.
          </Alert>
        )}

        {!isLoading && !error && p && (
          <Stack gap={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "end" }}
              justifyContent="space-between"
              gap={2}
            >
              <Stack
                direction="row"
                gap={2}
                alignItems="center"
                sx={{ minWidth: 0, flex: 1 }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  color={p.esta_activo ? "success" : "default"}
                  badgeContent=" "
                  variant="dot"
                >
                  <Avatar sx={{ width: 56, height: 56 }}>
                    {String(p.codigo || "?")
                      .slice(0, 2)
                      .toUpperCase()}
                  </Avatar>
                </Badge>

                <Stack sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    noWrap
                    title={p.descripcion}
                  >
                    {p.descripcion || "—"}
                  </Typography>

                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Código: <b>{p.codigo || "—"}</b>
                    </Typography>
                    {!!p.codigo && (
                      <Tooltip title="Copiar código">
                        <IconButton size="small" onClick={() => copy(p.codigo)}>
                          <ContentCopy fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>
              </Stack>

              <Stack direction="row" gap={1} flexWrap="wrap">
                {statusChips}
              </Stack>
            </Stack>

            <Divider />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Stack gap={1.25}>
                  <FieldRow
                    label="Código"
                    value={p.codigo}
                    icon={<QrCode2 fontSize="small" />}
                    action={
                      p.codigo ? (
                        <Tooltip title="Copiar código">
                          <IconButton
                            size="small"
                            onClick={() => copy(p.codigo)}
                            sx={{ padding: "0 0 0 10px", margin: 0 }}
                          >
                            <ContentCopy fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      ) : null
                    }
                  />
                  <FieldRow
                    label="Nro de serie"
                    value={p.nro_serie}
                    icon={<ConfirmationNumber fontSize="small" />}
                    action={
                      p.nro_serie ? (
                        <Tooltip title="Copiar nro. de serie">
                          <IconButton
                            size="small"
                            onClick={() => copy(p.nro_serie)}
                            sx={{ padding: "0 0 0 10px", margin: 0 }}
                          >
                            <ContentCopy fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      ) : null
                    }
                  />
                  <FieldRow
                    label="Descripción"
                    value={p.descripcion}
                    icon={<Description fontSize="small" />}
                  />
                  <FieldRow
                    label="Empresa"
                    value={p.empresa?.nombre}
                    icon={<Business fontSize="small" />}
                  />
                  <FieldRow
                    label="Sucursal"
                    value={p.sucursal?.nombre}
                    icon={<Store fontSize="small" />}
                  />
                  <FieldRow
                    label="Categoría"
                    value={p.categoria?.nombre}
                    icon={<Category fontSize="small" />}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Stack gap={1.25}>
                  <FieldRow
                    label="Estado del producto"
                    value={p.estado_producto?.descripcion}
                    icon={<Checklist fontSize="small" />}
                  />
                  <FieldRow
                    label="Tipo de producto"
                    value={p.tipo_producto?.descripcion}
                    icon={<Checklist fontSize="small" />}
                  />
                  <FieldRow
                    label="Tipo"
                    value={p.tipo?.descripcion}
                    icon={<Layers fontSize="small" />}
                  />
                  <FieldRow
                    label="Subtipo"
                    value={p.subtipo?.descripcion}
                    icon={<Layers fontSize="small" />}
                  />
                  <FieldRow
                    label="Marca"
                    value={p.marca?.descripcion}
                    icon={<Sell fontSize="small" />}
                  />
                  <FieldRow
                    label="Modelo"
                    value={p.modelo?.descripcion}
                    icon={<DevicesOther fontSize="small" />}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Divider />

            {/* Metadata */}
            <Stack gap={0.5}>
              <Typography variant="caption" color="text.secondary">
                Metadatos
              </Typography>

              <Grid container spacing={1.25}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    Creación: <b>{formatDate(p.fecha_creacion)}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Por: <b>{p.usuario_creacion || "—"}</b>
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    Modificación: <b>{formatDate(p.fecha_modificacion)}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Por: <b>{p.usuario_modificacion || "—"}</b>
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 4 }}>
        <Button variant="outlined" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
