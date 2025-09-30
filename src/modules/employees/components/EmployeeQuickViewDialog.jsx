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
  Email,
  PersonOutline,
  Business,
  Category,
  Apartment,
  Sync,
  SyncProblem,
  CloudDone,
} from "@mui/icons-material";

import { useFetchEmployeeByRut } from "../hooks/useFetchEmployeeByRut";

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

export default function EmployeeQuickViewDialog({ open, rut, onClose }) {
  const navigate = useNavigate();

  const { employeeDetail, loading, error } = useFetchEmployeeByRut(rut);

  const emp = employeeDetail ?? null;

  const statusChips = useMemo(() => {
    if (!emp) return null;

    const syncChip = emp.pendiente_sincronizar ? (
      <Tooltip title="Hay cambios pendientes de sincronizar desde BUK.">
        <Chip
          size="small"
          color="warning"
          variant="outlined"
          icon={<SyncProblem fontSize="small" />}
          label="Pendiente de sincronizar"
        />
      </Tooltip>
    ) : (
      <Tooltip title="Este empleado está sincronizado con BUK.">
        <Chip
          size="small"
          color="info"
          variant="outlined"
          icon={<CloudDone fontSize="small" />}
          label="Sincronizado"
        />
      </Tooltip>
    );

    return (
      <Stack direction="row" gap={1} flexWrap="wrap">
        <Chip
          size="small"
          label={emp.esta_activo ? "Activo" : "Inactivo"}
          color={emp.esta_activo ? "success" : "default"}
          variant={emp.esta_activo ? "filled" : "outlined"}
        />
        {syncChip}
      </Stack>
    );
  }, [emp]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="ver-empleado"
    >
      <DialogTitle id="ver-empleado" sx={{ py: 1.5 }}>
        <Stack direction="row" alignItems="center" gap={1.25}>
          <PersonOutline />
          <Typography fontWeight={700}>Empleado</Typography>
          <Stack sx={{ flex: 1 }} />
          <IconButton aria-label="Cerrar" onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        {loading && (
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

        {error && !loading && (
          <Alert
            severity="error"
            sx={{ borderRadius: 2, mb: 1 }}
            action={
              <Button color="inherit" size="small" onClick={() => navigate(0)}>
                Reintentar
              </Button>
            }
          >
            Error al cargar la información del empleado.
          </Alert>
        )}

        {!loading && !error && emp && (
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
                  color={emp.pendiente_sincronizar ? "warning" : "success"}
                  badgeContent=" "
                  variant="dot"
                >
                  <Avatar sx={{ width: 56, height: 56 }}>
                    {initials(emp.nombre_completo)}
                  </Avatar>
                </Badge>
                <Stack sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    noWrap
                    title={emp.nombre_completo}
                  >
                    {emp.nombre_completo}
                  </Typography>
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography variant="body2" color="text.secondary">
                      RUT: <b>{emp.rut}</b>
                    </Typography>
                    <Tooltip title="Copiar RUT">
                      <IconButton size="small" onClick={() => copy(emp.rut)}>
                        <ContentCopy fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
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
                    label="Nombres"
                    value={emp.nombre}
                    icon={<PersonOutline fontSize="small" />}
                  />
                  <FieldRow
                    label="Apellidos"
                    value={
                      `${emp.apellido_paterno ?? ""} ${
                        emp.apellido_materno ?? ""
                      }`.trim() || "—"
                    }
                    icon={<PersonOutline fontSize="small" />}
                  />
                  <FieldRow
                    label="Email"
                    value={emp.email || "—"}
                    icon={<Email fontSize="small" />}
                    action={
                      emp.email ? (
                        <Tooltip title="Copiar email">
                          <IconButton
                            size="small"
                            onClick={() => copy(emp.email)}
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

              <Grid size={{ xs: 12, md: 5 }}>
                <Stack gap={1.25}>
                  <FieldRow
                    label="Empresa"
                    value={emp.empresa?.nombre}
                    icon={<Business fontSize="small" />}
                  />
                  <FieldRow
                    label="Centro de costos"
                    value={emp.centrocosto?.centro_costo_nombre}
                    icon={<Apartment fontSize="small" />}
                  />
                  <FieldRow
                    label="Categoría"
                    value={emp.categoria?.nombre}
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
                    Creación: <b>{formatDate(emp.fecha_creacion)}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Por: <b>{emp.usuario_creacion || "—"}</b>
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">
                    Modificación: <b>{formatDate(emp.fecha_modificacion)}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Por: <b>{emp.usuario_modificacion || "—"}</b>
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 4 }}>
        <Button
          variant="outlined"
          startIcon={<Sync />}
          onClick={() => {}}
          disabled={!emp || !emp?.pendiente_sincronizar}
        >
          {emp?.pendiente_sincronizar ? "Sincronizar ahora" : "Sincronizado"}
        </Button>

        <Button variant="outlined" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
