import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";

import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  ContentCopy,
  Inventory2,
  Business,
  Store,
  Category,
  Checklist,
  Description,
  IntegrationInstructions,
  Assignment,
  CalendarMonth,
  Payments,
  MonetizationOn,
  Layers,
  Sell,
  DevicesOther,
  ConfirmationNumber,
} from "@mui/icons-material";

import { useFetchProductByCode } from "../hooks/useFetchProductByCode";

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
  return { style: "currency", currency: "USD" };
}
function formatMoney(value, monedaDescripcion) {
  if (value === null || value === undefined || value === "") return "—";
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

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { codigo } = useParams();
  const { productDetail, isLoading, error } = useFetchProductByCode(codigo);
  const p = productDetail ?? null;

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
        {p?.moneda?.descripcion && (
          <Chip
            size="small"
            label={p.moneda.descripcion}
            color="default"
            variant="outlined"
            icon={<Payments sx={{ fontSize: 16 }} />}
          />
        )}
      </Stack>
    );
  }, [p]);

  const precioFmt = useMemo(
    () => (p ? formatMoney(p.precio, p.moneda?.descripcion) : "—"),
    [p]
  );

  return (
    <Container maxWidth={false} sx={{ px: 2, py: 3 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="Volver">
            <ArrowBack />
          </IconButton>
          <Inventory2 />
          <Typography variant="h6" fontWeight={700}>
            Detalle del producto
          </Typography>
          <Stack sx={{ flex: 1 }} />
          {/* <Button variant="contained">Editar</Button> */}
        </Stack>

        {/* Resumen / header gráfico */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                color={p?.esta_activo ? "success" : "default"}
                variant="dot"
              >
                <Avatar sx={{ width: 64, height: 64 }}>
                  {String(p?.codigo || "?")
                    .slice(0, 2)
                    .toUpperCase()}
                </Avatar>
              </Badge>
              <Stack>
                <Typography variant="h6" fontWeight={700}>
                  {p?.descripcion || "—"}
                </Typography>
                <Stack direction="row" gap={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Código: <b>{p?.codigo || "—"}</b>
                  </Typography>
                  {!!p?.codigo && (
                    <Tooltip title="Copiar código">
                      <IconButton size="small" onClick={() => copy(p.codigo)}>
                        <ContentCopy fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>
            </Stack>
            {statusChips}
          </Stack>
        </Paper>

        {isLoading && <Skeleton variant="rectangular" height={300} />}
        {error && !isLoading && (
          <Alert severity="error">
            Error al cargar la información del producto.
          </Alert>
        )}

        {!isLoading && !error && p && (
          <Box>
            <Grid
              container
              spacing={3}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(auto-fit, minmax(300px, 1fr))",
                },
                gap: 3,
              }}
            >
              {/* Paper: Organización */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Organización
                </Typography>
                <Divider sx={{ mb: 2 }} />
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
              </Paper>

              {/* Paper: Producto Info */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Información de producto
                </Typography>
                <Divider sx={{ mb: 2 }} />
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
                  label="Descripción"
                  value={p.descripcion}
                  icon={<Description fontSize="small" />}
                />
                <FieldRow
                  label="Código del sistema"
                  value={p.codigo_sistema}
                  icon={<IntegrationInstructions fontSize="small" />}
                  action={
                    p.codigo_sistema ? (
                      <Tooltip title="Copiar código">
                        <IconButton
                          size="small"
                          onClick={() => copy(p.codigo_sistema)}
                          sx={{ p: 0, pl: 1 }}
                        >
                          <ContentCopy fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    ) : null
                  }
                />
                <FieldRow
                  label="Serie / Nº de serie"
                  value={p.nro_serie}
                  icon={<ConfirmationNumber fontSize="small" />}
                />
              </Paper>

              {/* Paper: Datos internos / administrativos */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Administrativos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <FieldRow
                  label="Contrato"
                  value={p.contrato?.descripcion}
                  icon={<Assignment fontSize="small" />}
                />
                <FieldRow
                  label="Fecha de ingreso"
                  value={formatDateOnly(p.fecha_ingreso)}
                  icon={<CalendarMonth fontSize="small" />}
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
              </Paper>

              {/* Paper: Características técnicas */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Características técnicas
                </Typography>
                <Divider sx={{ mb: 2 }} />
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
              </Paper>

              {/* Paper: Metadatos */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Metadatos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1.25}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Creación: <b>{formatDateTime(p.fecha_creacion)}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Por: <b>{p.usuario_creacion || "—"}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Modificación:{" "}
                      <b>{formatDateTime(p.fecha_modificacion)}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Por: <b>{p.usuario_modificacion || "—"}</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Observaciones
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={8}
                  placeholder="Escribe una observación…"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  // value={obsTexto}     // estado local
                  // onChange={(e) => setObsTexto(e.target.value)}
                />

                <Button
                  variant="contained"
                  size="small"
                  // onClick={handleEnviarObservacion}
                  // disabled={!obsTexto.trim()}
                >
                  Enviar
                </Button>

                {/* Luego aquí tu lista de observaciones */}
                {/* <YourObservationsList productId={p.id || codigo} /> */}
              </Paper>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}
