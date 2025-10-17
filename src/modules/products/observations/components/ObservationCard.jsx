import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  DeleteOutline,
  EditNote,
  Link as LinkIcon,
  PushPin as PushPinIcon,
  ExpandMore,
  ExpandLess,
  MoreVert,
} from "@mui/icons-material";
import ObservationMeta from "./ObservationMeta";

const initials = (name = "") =>
  name
    .split(" ")
    .map((n) => n?.[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

function relativeTime(dateLike) {
  const d = new Date(dateLike);
  if (isNaN(d)) return "";
  const diff = (Date.now() - d.getTime()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return "hace unos segundos";
  if (abs < 3600) return `hace ${Math.floor(abs / 60)} min`;
  if (abs < 86400) return `hace ${Math.floor(abs / 3600)} h`;
  if (abs < 86400 * 7) return `hace ${Math.floor(abs / 86400)} d`;
  return d.toLocaleString();
}

export function ObservationCard({
  observation,
  onEdit, // (id) => void
  onDelete, // (id) => Promise<void> | void
  maxCollapsedLines = 4,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [expanded, setExpanded] = useState(false);
  const [snack, setSnack] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuEl, setMenuEl] = useState(null);

  const dateISO = useMemo(
    () => observation?.fecha_modificacion || observation?.fecha_creacion,
    [observation?.fecha_modificacion, observation?.fecha_creacion]
  );

  console.log("Datos de la observación", observation);

  const dateTooltip = useMemo(() => {
    const d = new Date(dateISO);
    return isNaN(d) ? "" : d.toLocaleString();
  }, [dateISO]);

  const dateLabel = useMemo(() => relativeTime(dateISO), [dateISO]);

  const showExpand = (observation?.observacion?.length ?? 0) > 240;

  const handleDelete = async () => {
    try {
      await onDelete?.(observation.id);
      setSnack("Observación eliminada");
    } catch {
      setSnack("No se pudo eliminar");
    } finally {
      setConfirmOpen(false);
    }
  };

  const actionsInline = (
    <Stack direction="row" spacing={0.25} alignItems="center">
      <Tooltip title="Editar">
        <span>
          <IconButton
            size="small"
            aria-label="editar observación"
            onClick={() => onEdit?.(observation.id)}
            // disabled={!onEdit}
          >
            <EditNote fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Eliminar">
        <span>
          <IconButton
            size="small"
            aria-label="eliminar observación"
            onClick={() => setConfirmOpen(true)}
            // disabled={!onDelete}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );

  return (
    <Paper
      role="article"
      aria-label={`Observación de ${
        observation?.usuario_modificacion ??
        observation?.usuario_creacion ??
        "usuario"
      }`}
      variant="outlined"
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        // position: "relative",
        // borderLeftWidth: 4,
        // borderLeftStyle: "solid",
        // borderLeftColor: item?.pinned ? "warning.main" : "divider",
      }}
    >
      {/* Badge de fijado */}
      {observation?.pinned && (
        <Chip
          size="small"
          variant="outlined"
          color="warning"
          icon={<PushPinIcon sx={{ fontSize: 16 }} />}
          label="Fijada"
          sx={{ position: "absolute", top: 8, right: 8 }}
        />
      )}

      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Avatar sx={{ width: 36, height: 36 }}>
          {initials(
            observation?.usuario_modificacion || observation?.usuario_creacion
          )}
        </Avatar>

        <Stack sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body2"
            fontWeight={700}
            noWrap
            title={
              observation?.usuario_modificacion || observation?.usuario_creacion
            }
          >
            {observation?.usuario_modificacion ||
              observation?.usuario_creacion ||
              "—"}
          </Typography>

          <Tooltip title={dateTooltip}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              {dateLabel || "—"}
            </Typography>
          </Tooltip>
        </Stack>

        {/* acciones (menu en XS) */}
        {isXs ? (
          <>
            <IconButton
              size="small"
              aria-label="más acciones"
              onClick={(e) => setMenuEl(e.currentTarget)}
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={menuEl}
              open={Boolean(menuEl)}
              onClose={() => setMenuEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  onEdit?.(observation.id);
                  setMenuEl(null);
                }}
                disabled={!onEdit}
              >
                <EditNote sx={{ mr: 1 }} /> Editar
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setConfirmOpen(true);
                  setMenuEl(null);
                }}
                disabled={!onDelete}
                sx={{ color: "error.main" }}
              >
                <DeleteOutline sx={{ mr: 1 }} /> Eliminar
              </MenuItem>
            </Menu>
          </>
        ) : (
          actionsInline
        )}
      </Stack>

      {/* Body con clamp + fade */}
      <Box
        sx={{
          mt: 1.25,
          position: "relative",
          "&::after":
            !expanded && showExpand
              ? {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 36,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
                  // soporta dark mode
                  [`.${theme.palette.mode === "dark" ? "&" : "&"}`]: {
                    background:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))"
                        : "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
                  },
                }
              : {},
        }}
      >
        <Box sx={{ mb: 2, mt: 2 }}>
          <ObservationMeta observation={observation} />
        </Box>

        <Typography
          variant="body2"
          id={`obs-body-${observation.id}`}
          sx={{
            whiteSpace: "pre-wrap",
            display: "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : maxCollapsedLines,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
          }}
        >
          {observation?.observacion || "—"}
        </Typography>
      </Box>

      {/* Toggle expand */}
      {showExpand && (
        <Box sx={{ mt: 0.5 }}>
          <Button
            size="small"
            variant="text"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={`obs-body-${observation.id}`}
            startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            sx={{ textTransform: "none", px: 0.5 }}
          >
            {expanded ? "Ver menos" : "Ver más"}
          </Button>
        </Box>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Eliminar observación</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            ¿Seguro que deseas eliminar esta observación? Esta acción no se
            puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" onClick={handleDelete} variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2200}
        onClose={() => setSnack("")}
        message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Paper>
  );
}
