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
  PersonOutline,
  Business,
  Category,
  Apartment,
  EditSquare,
  CalendarMonthOutlined,
  DocumentScanner,
} from "@mui/icons-material";

import { useFetchContractByCode } from "../hooks/useFetchContractByCode";

function formatDate(dateStr) {
  const d = dayjs(dateStr);
  return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : "—";
}

function initials(fullname = "") {
  return fullname
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
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

export default function ContractQuickViewDialog({ open, code, onClose }) {
  const navigate = useNavigate();

  const { contractDetail, isLoading, error } = useFetchContractByCode(code);

  const contract = contractDetail ?? null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="ver-contrato"
    >
      <DialogTitle id="ver-contrato" sx={{ py: 1.5 }}>
        <Stack direction="row" alignItems="center" gap={1.25}>
          <DocumentScanner />
          <Typography fontWeight={700}>Contrato</Typography>
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
              <Button
                color="inherit"
                variant="text"
                size="small"
                onClick={() => navigate(0)}
              >
                Reintentar
              </Button>
            }
          >
            Error al cargar la información del contrato.
          </Alert>
        )}

        {!isLoading && !error && contract && (
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
                  color={contract?.esta_activo ? "success" : "default"}
                  badgeContent=" "
                  variant="dot"
                >
                  <Avatar sx={{ width: 56, height: 56 }}>
                    {initials(contract?.descripcion)}
                  </Avatar>
                </Badge>
                <Stack sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    noWrap
                    title={contract?.descripcion}
                  >
                    {contract?.descripcion}
                  </Typography>
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Código: <b>{contract?.codigo}</b>
                    </Typography>
                    <Tooltip title="Copiar Código">
                      <IconButton
                        size="small"
                        onClick={() => copy(contract?.codigo)}
                      >
                        <ContentCopy fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Stack>

              <Stack direction="row" gap={1} flexWrap="wrap">
                <Chip
                  size="small"
                  label={contract?.esta_activo ? "Activo" : "Inactivo"}
                  color={contract?.esta_activo ? "success" : "default"}
                  variant={contract?.esta_activo ? "filled" : "outlined"}
                />
              </Stack>
            </Stack>

            <Divider />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Stack gap={1.25}>
                  <FieldRow
                    label="Descripción"
                    value={contract?.descripcion ?? "—"}
                    icon={<PersonOutline fontSize="small" />}
                  />
                  <FieldRow
                    label="Fecha inicio vigencia"
                    value={`${contract?.fecha_inicio_vigencia ?? ""}`}
                    icon={<CalendarMonthOutlined fontSize="small" />}
                  />
                  <FieldRow
                    label="Fecha fin vigencia"
                    value={`${contract?.fecha_fin_vigencia ?? ""}`}
                    icon={<CalendarMonthOutlined fontSize="small" />}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Stack gap={1.25}>
                  <FieldRow
                    label="Empresa"
                    value={contract.empresa?.nombre}
                    icon={<Business fontSize="small" />}
                  />
                  <FieldRow
                    label="Sucursal"
                    value={`${contract?.sucursal?.nombre}`}
                    icon={<Apartment fontSize="small" />}
                  />
                  <FieldRow
                    label="Categoría"
                    value={contract.categoria?.nombre}
                    icon={<Category fontSize="small" />}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Divider />

            <Stack gap={0.5}>
              <Typography variant="caption" color="text.secondary">
                Metadatos
              </Typography>

              <Grid container spacing={1.25}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    Creación: <b>{formatDate(contract.fecha_creacion)}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Por: <b>{contract.usuario_creacion || "—"}</b>
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    Modificación:{" "}
                    <b>{formatDate(contract.fecha_modificacion)}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Por: <b>{contract.usuario_modificacion || "—"}</b>
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 4 }}>
        <Button
          variant="contained"
          startIcon={<EditSquare />}
          onClick={() =>
            navigate(`/maestros/contratos/${encodeURIComponent(code)}/editar`)
          }
        >
          Editar
        </Button>

        <Button variant="outlined" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
