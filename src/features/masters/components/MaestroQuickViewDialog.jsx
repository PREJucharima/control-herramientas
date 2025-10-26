import { useMemo } from "react";
import { useNavigate } from "react-router";

import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Typography,
  Chip,
  Button,
  Alert,
  Skeleton,
} from "@mui/material";
import { Close, Inventory2 } from "@mui/icons-material";

import { useFetchMaestroBySlug } from "../hooks/useFetchMaestroBySlug";
import { useMaestrosStore } from "../states/maestrosStore";

const MaestroQuickViewDialog = ({ open, slug, onClose }) => {
  const { loading, error } = useFetchMaestroBySlug(slug);
  const { maestroBySlug } = useMaestrosStore();
  const maestros = useMaestrosStore((state) => state.maestros);
  const navigate = useNavigate();

  const nombreCatalogoDependiente = useMemo(() => {
    if (!maestroBySlug?.depende_de_maestro) return null;

    const maestroDependiente = maestros.find(
      (m) => m.id === maestroBySlug.depende_de_maestro
    );

    return maestroDependiente?.nombre;
  }, [maestros, maestroBySlug]);

  console.log(nombreCatalogoDependiente);

  const dateFormat = (dateStr) => {
    return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="ver-maestro"
    >
      <DialogTitle id="ver-maestro">
        <Stack direction="row" alignItems="center" gap={1.25}>
          <Inventory2 />
          <Typography fontWeight={700}>Maestro</Typography>
          <Chip
            size="small"
            label={maestroBySlug?.esta_activo ? "Activo" : "Inactivo"}
            color={maestroBySlug?.esta_activo ? "success" : "default"}
            variant={maestroBySlug?.esta_activo ? "filled" : "outlined"}
          />
          <Stack sx={{ flex: 1 }} />
          <IconButton aria-label="Cerrar" onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Stack gap={1.5}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rectangular" height={80} />
          </Stack>
        )}

        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => navigate(0)}>
                Reintentar
              </Button>
            }
          >
            Error al cargar el maestro.
          </Alert>
        )}

        {!loading && !error && Object.keys(maestroBySlug).length > 0 && (
          <Stack gap={1}>
            <Typography variant="subtitle1" fontWeight={700}>
              {maestroBySlug.nombre}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Código único: <b>{maestroBySlug.codigo_unico}</b>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Usuario creador: <b>{maestroBySlug.usuario_creacion}</b>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Depende de catálogo:{" "}
              <b>
                {nombreCatalogoDependiente ??
                  maestroBySlug?.depende_de_maestro ??
                  "—"}
              </b>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Fechas: creación{" "}
              <b>{dateFormat(maestroBySlug.fecha_creacion) ?? "—"}</b> -
              modificación{" "}
              <b>{dateFormat(maestroBySlug.fecha_modificacion) ?? "—"}</b>
            </Typography>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="outlined"
          onClick={() => {
            navigate(`/catalogos/${encodeURIComponent(slug)}/lista-items`);
          }}
        >
          Ver ítems
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            navigate(`/catalogos/maestros/${encodeURIComponent(slug)}/editar`);
          }}
        >
          Editar
        </Button>

        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaestroQuickViewDialog;
