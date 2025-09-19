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
import { useNavigate } from "react-router";
import { useFetchItemBySlug } from "../hooks/useFetchItemBySlug";
import dayjs from "dayjs";
// import { useItemsStore } from "../states/itemsStore";
import { useMemo } from "react";
import { useFetchItemsByMaestro } from "../hooks/useFetchItemsByMaestro";
import { useFetchMaestros } from "../../maestros/hooks/useFetchMaestros";

export default function ItemQuickViewDialog({
  open,
  maestroSlug,
  itemSlug,
  onClose,
}) {
  const { itemBySlug, loading, error } = useFetchItemBySlug(
    maestroSlug,
    itemSlug
  );
  const navigate = useNavigate();
  const { maestros = [] } = useFetchMaestros();
  const maestroActual = useMemo(
    () => maestros.find((m) => m.codigo_unico === maestroSlug),
    [maestros, maestroSlug]
  );

  // const dependeDeCatalogo = maestroActual?.depende_de_catalogo ?? null;
  const maestroId = maestroActual?.id ?? null;

  const { itemsByMaestro } = useFetchItemsByMaestro(maestroId);
  const fmt = (d) => (d ? dayjs(d).format("DD/MM/YYYY") : "—");

  const itemPadreNombre = useMemo(() => {
    if (!itemBySlug?.item_padre) return null;
    const found = itemsByMaestro?.find(
      (m) => Number(m.id) === Number(itemBySlug.item_padre)
    );
    return found?.descripcion ?? null;
  }, [itemsByMaestro, itemBySlug]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="ver-item"
    >
      <DialogTitle id="ver-item">
        <Stack direction="row" alignItems="center" gap={1.25}>
          <Inventory2 />
          <Typography fontWeight={700}>Ítem</Typography>
          <Chip
            size="small"
            label={itemBySlug?.esta_activo ? "Activo" : "Inactivo"}
            color={itemBySlug?.esta_activo ? "success" : "default"}
            variant={itemBySlug?.esta_activo ? "filled" : "outlined"}
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

        {error && <Alert severity="error">Error al cargar el ítem.</Alert>}

        {!loading && !error && itemBySlug && (
          <Stack gap={1}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              noWrap
              title={itemBySlug.descripcion}
            >
              {itemBySlug.descripcion || "Ítem sin descripción"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Código: <b>{itemBySlug.codigo ?? "—"}</b>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Usuario creador: <b>{itemBySlug.usuario_creacion ?? "—"}</b>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Depende de: <b> {itemPadreNombre ?? "—"}</b>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Descripción corta: <b>{itemBySlug.descripcion_corta ?? "—"}</b>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Vigencia:{" "}
              <b>
                {fmt(itemBySlug.fecha_inicio_vigencia)} →{" "}
                {fmt(itemBySlug.fecha_fin_vigencia)}
              </b>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Creación: <b>{fmt(itemBySlug.fecha_creacion)}</b> · Modificación:{" "}
              <b>{fmt(itemBySlug.fecha_modificacion)}</b>
            </Typography>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="contained"
          onClick={() =>
            navigate(
              `/catalogos/maestros/${encodeURIComponent(
                maestroSlug
              )}/${encodeURIComponent(itemSlug)}/editar`
            )
          }
        >
          Editar
        </Button>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
