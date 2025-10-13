import { useMemo } from "react";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

import {
  Alert,
  Avatar,
  Badge,
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
  MonetizationOn,
  CalendarMonth,
  ReceiptLong,
  IntegrationInstructions,
  Assignment,
  Payments,
} from "@mui/icons-material";

import { useFetchProductByCode } from "../hooks/useFetchProductByCode";

// =============================
// Helpers
// =============================
function formatDateTime(dateStr) {
  const d = dayjs(dateStr);
  return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : "—";
}

function formatDateOnly(dateStr) {
  const d = dayjs(dateStr);
  return d.isValid() ? d.format("DD/MM/YYYY") : "—";
}

function normalizeCurrency(monedaDescripcion) {
  if (!monedaDescripcion) return { style: "currency", currency: "USD" };
  const m = (monedaDescripcion || "").toString().toLowerCase().trim();

  // Heurística simple para los casos más comunes
  if (
    ["pen", "sol", "soles", "nuevo sol", "sol peruano"].some((t) =>
      m.includes(t)
    )
  )
    return { style: "currency", currency: "PEN" };
  if (
    ["usd", "dolar", "dólar", "dolares", "dólares", "us$"].some((t) =>
      m.includes(t)
    )
  )
    return { style: "currency", currency: "USD" };
  if (["eur", "euro", "euros"].some((t) => m.includes(t)))
    return { style: "currency", currency: "EUR" };

  // Si viene algo como "PEN (Soles)" y quieres extraer código, podrías mejorar esto
  return { style: "currency", currency: "USD" };
}

function formatMoney(value, monedaDescripcion) {
  if (value === null || value === undefined || value === "") return "—";
  // Acepta string o number; limpia comas/espacios
  const n = Number(String(value).replace(/[,\s]/g, ""));
  if (Number.isNaN(n)) return String(value);

  const nf = new Intl.NumberFormat(
    "es-PE",
    normalizeCurrency(monedaDescripcion)
  );
  return nf.format(n);
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
          title={(value ?? "—")?.toString()}
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
        {p?.moneda?.descripcion ? (
          <Chip
            size="small"
            label={p.moneda.descripcion}
            color="default"
            variant="outlined"
            icon={<Payments sx={{ fontSize: 16 }} />}
          />
        ) : null}
      </Stack>
    );
  }, [p]);

  // Precio formateado
  const precioFmt = useMemo(
    () => (p ? formatMoney(p.precio, p.moneda?.descripcion) : "—"),
    [p]
  );

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
            {/* Header */}
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

            {/* Cuerpo */}
            <Grid container spacing={2}>
              {/* Columna izquierda */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Stack gap={1.25}>
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
                    label="Código del sistema"
                    value={p.codigo_sistema}
                    icon={<IntegrationInstructions fontSize="small" />}
                    action={
                      p.codigo_sistema ? (
                        <Tooltip title="Copiar código del sistema">
                          <IconButton
                            size="small"
                            onClick={() => copy(p.codigo_sistema)}
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
                    label="Fecha de ingreso"
                    value={formatDateOnly(p.fecha_ingreso)}
                    icon={<CalendarMonth fontSize="small" />}
                  />
                  <FieldRow
                    label="Orden de compra"
                    value={p.orden_compra}
                    icon={<ReceiptLong fontSize="small" />}
                    action={
                      p.orden_compra ? (
                        <Tooltip title="Copiar orden de compra">
                          <IconButton
                            size="small"
                            onClick={() => copy(p.orden_compra)}
                            sx={{ padding: "0 0 0 10px", margin: 0 }}
                          >
                            <ContentCopy fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      ) : null
                    }
                  />
                </Stack>
              </Grid>

              {/* Columna derecha */}
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

                  <FieldRow
                    label="Contrato"
                    value={p.contrato?.descripcion}
                    icon={<Assignment fontSize="small" />}
                  />
                  <FieldRow
                    label="Moneda"
                    value={p.moneda?.descripcion}
                    icon={<Payments fontSize="small" />}
                  />
                  <FieldRow
                    label="Precio"
                    value={precioFmt}
                    icon={<MonetizationOn fontSize="small" />}
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
                    Creación: <b>{formatDateTime(p.fecha_creacion)}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Por: <b>{p.usuario_creacion || "—"}</b>
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    Modificación: <b>{formatDateTime(p.fecha_modificacion)}</b>
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
