import { useMemo, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  EditNote,
  ExpandMore,
  ExpandLess,
  MoreVert,
  VisibilityOffOutlined,
  VisibilityOutlined,
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
  onEdit,
  onToggleActive,
  maxCollapsedLines = 4,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [expanded, setExpanded] = useState(false);
  const [menuEl, setMenuEl] = useState(null);

  // const dateLabel = useMemo(() => relativeTime(dateISO), [dateISO]);
  const showExpand = (observation?.observacion?.length ?? 0) > 240;
  const inactive = !observation.esta_activo;

  // utils locales
  const toDate = (v) => (v ? new Date(v) : null);
  const fmtExact = (d) => (d ? d.toLocaleString() : "—");

  const createdAt = toDate(observation?.fecha_creacion);
  const updatedAt = toDate(observation?.fecha_modificacion);
  const isEdited =
    updatedAt && createdAt && updatedAt.getTime() > createdAt.getTime();

  // Para mostrar relativo usa updatedAt si fue editado; si no, createdAt
  const shownDate = isEdited ? updatedAt : createdAt;
  const dateLabel = useMemo(() => relativeTime(shownDate), [shownDate]);

  // Tooltip con ambas fechas
  const dateTooltip = useMemo(() => {
    if (!createdAt && !updatedAt) return "";
    const c = `Creado: ${fmtExact(createdAt)}`;
    const u = `Editado: ${fmtExact(updatedAt)}`;
    return isEdited ? `${u}\n${c}` : c;
  }, [createdAt, updatedAt, isEdited]);

  const actionsInline = (
    <Stack direction="row" spacing={0.25} alignItems="center">
      <Tooltip title="Editar">
        <span>
          <IconButton
            size="small"
            aria-label="editar observación"
            onClick={() => onEdit?.(observation.id)}
          >
            <EditNote />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip
        title={`${observation.esta_activo ? "Ocultar" : "Mostrar"} observación`}
      >
        <span>
          <IconButton
            size="small"
            aria-label={`${
              observation.esta_activo ? "Ocultar" : "Mostrar"
            } observación`}
            onClick={() =>
              onToggleActive?.(observation.id, !observation.esta_activo)
            }
            sx={(t) => ({
              color: inactive ? t.palette.grey[400] : t.palette.text.secondary,
            })}
          >
            {observation.esta_activo ? (
              <VisibilityOutlined />
            ) : (
              <VisibilityOffOutlined />
            )}
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
        position: "relative",
        borderLeftWidth: 2,
        borderLeftStyle: "solid",
        borderLeftColor: observation?.esta_activo ? "primary.main" : "divider",
      }}
    >
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
              aria-label={
                isEdited
                  ? `Editado ${dateLabel} (creado ${fmtExact(createdAt)})`
                  : `Creado ${dateLabel}`
              }
            >
              {dateLabel} {isEdited && "· editado"}
            </Typography>
          </Tooltip>
        </Stack>

        {inactive && (
          <Chip
            label="Inactiva"
            size="small"
            variant="outlined"
            sx={(t) => ({
              ml: 1,
              color: t.palette.text.secondary,
              borderColor: t.palette.grey[300],
              bgcolor: t.palette.grey[100],
            })}
          />
        )}

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
    </Paper>
  );
}
