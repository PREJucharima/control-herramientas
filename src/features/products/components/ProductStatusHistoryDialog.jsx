import { useMemo } from "react";
import {
  alpha,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Stack,
  Skeleton,
  Alert,
  TablePagination,
  Tooltip,
  Divider,
  ListSubheader,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import { useProductStatusHistory } from "../history/hooks/useProductStatusHistory";
import { useFetchProductByCode } from "../hooks/useFetchProductByCode";

dayjs.extend(relativeTime);
dayjs.locale("es");

const statusColor = (desc = "") => {
  const d = desc.toUpperCase().trim();
  if (["DISPONIBLE"].includes(d)) return "success";
  if (["ASIGNADO"].includes(d)) return "info";
  if (["COMPRADO POR USUARIO"].includes(d)) return "warning";
  if (["BAJA DEFINITIVA", "ROBADO"].includes(d)) return "error";
  return "default";
};

const isAssigned = (desc = "") =>
  (desc || "").toString().trim().toUpperCase() === "ASIGNADO";

const getAssignedMeta = (h) => {
  return {
    usuario: "Juan Pérez",
    fecha: h?.fecha_creacion || new Date().toISOString(),
    codigo: "ASG-2025-000123",
  };
};

const DateText = ({ iso }) => {
  if (!iso) return <span>—</span>;
  const d = dayjs(iso);
  const isToday = d.isSame(dayjs(), "day");
  const isYesterday = d.isSame(dayjs().subtract(1, "day"), "day");
  const full = d.format("DD/MM/YYYY HH:mm");
  return (
    <Tooltip title={full}>
      <span>{isToday ? "hoy" : isYesterday ? "ayer" : d.fromNow()}</span>
    </Tooltip>
  );
};

export default function ProductStatusHistoryDialog({
  open,
  productCode,
  onClose,
}) {
  const {
    history,
    pagination,
    isLoading,
    error,
    handleChangePage,
    handleChangePageSize,
  } = useProductStatusHistory(productCode, 1, 10);

  const { productDetail } = useFetchProductByCode(productCode);

  const title = useMemo(
    () =>
      `Historial de estados ${
        productCode &&
        `· ${productDetail?.descripcion} - ${productDetail?.nro_serie}`
      }`,
    [productCode, productDetail]
  );

  const groups = useMemo(() => {
    if (!history?.length) return [];
    const map = history.reduce((acc, h) => {
      const key = h?.fecha_creacion
        ? dayjs(h.fecha_creacion).format("YYYY-MM-DD")
        : "sin-fecha";
      (acc[key] ||= []).push(h);
      return acc;
    }, {});
    return Object.entries(map).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [history]);

  const humanDay = (key) => {
    if (key === "sin-fecha") return "Sin fecha";
    const d = dayjs(key);
    if (d.isSame(dayjs(), "day")) return "Hoy";
    if (d.isSame(dayjs().subtract(1, "day"), "day")) return "Ayer";
    return d.format("DD MMM YYYY");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          aria-label="Cerrar diálogo de historial"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <ListSubheader
          disableSticky
          component="div"
          sx={(t) => ({
            px: 2,
            py: 1,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.4,
            color: t.palette.text.secondary,
            bgcolor: alpha(t.palette.background.paper, 0.85),
            borderBottom: `1px solid ${t.palette.divider}`,
          })}
        >
          {isLoading
            ? "Cargando movimientos…"
            : `${pagination.count} movimiento${
                pagination.count === 1 ? "" : "s"
              }`}
        </ListSubheader>

        {isLoading && (
          <Box sx={{ p: 2 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={1.5}
                sx={{ mb: 2, px: 1 }}
              >
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="50%" />
                  <Skeleton variant="text" />
                </Box>
              </Stack>
            ))}
          </Box>
        )}

        {!isLoading && error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">
              Error al cargar historial:{" "}
              {error?.message || "Intenta nuevamente."}
            </Alert>
          </Box>
        )}

        {!isLoading && !error && history.length === 0 && (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">Sin movimientos de estado.</Alert>
          </Box>
        )}

        {!isLoading && !error && history.length > 0 && (
          <List disablePadding>
            {groups.map(([dayKey, items], gi) => (
              <Box
                key={dayKey}
                sx={(t) => ({
                  bgcolor:
                    gi % 2
                      ? alpha(t.palette.primary.main, 0.02)
                      : "transparent",
                })}
              >
                <ListSubheader
                  disableSticky
                  component="div"
                  sx={(t) => ({
                    px: 2,
                    py: 1,
                    mt: gi === 0 ? 0 : 0.5,
                    fontWeight: 700,
                    fontSize: 12,
                    color: t.palette.text.secondary,
                    background: "transparent",
                  })}
                >
                  {humanDay(dayKey)}
                </ListSubheader>

                {items.map((h, idx) => {
                  const prev = h.estado_producto_anterior?.descripcion || "—";
                  const next = h.estado_producto_nuevo?.descripcion || "—";
                  const who = h.usuario_creacion || "—";
                  const motive = h.motivo || "";
                  const assigned = isAssigned(next);
                  const assignedMeta = assigned ? getAssignedMeta(h) : null;

                  const aria = `Cambio de estado: ${prev} a ${next}, ${dayjs(
                    h.fecha_creacion
                  ).fromNow()}, por ${who}${
                    motive ? `, motivo ${motive}` : ""
                  }`;

                  return (
                    <ListItem
                      key={h.id ?? `${dayKey}-${idx}`}
                      aria-label={aria}
                      sx={(t) => ({
                        mx: 1,
                        my: 1,
                        px: 1.5,
                        py: 2,
                        alignItems: "flex-start",
                        borderRadius: 2,
                        border: `1px solid ${t.palette.divider}`,
                        backgroundColor: t.palette.background.paper,
                        transition:
                          "background-color .2s ease, box-shadow .2s ease",
                        "&:hover": {
                          backgroundColor: alpha(t.palette.primary.main, 0.03),
                          boxShadow: t.shadows[1],
                        },
                        position: "relative",
                        "& .MuiListItemAvatar-root": {
                          position: "relative",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 36,
                            bottom: -12,
                            left: "50%",
                            width: 2,
                            transform: "translateX(-50%)",
                            backgroundColor: alpha(
                              t.palette.text.disabled,
                              0.2
                            ),
                            display:
                              idx === items.length - 1 ? "none" : "block",
                          },
                        },
                      })}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={(t) => ({
                            width: 36,
                            height: 36,
                            bgcolor: alpha(t.palette.primary.main, 0.08),
                            color: t.palette.primary.main,
                          })}
                        >
                          <HistoryIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                          >
                            <Chip
                              size="small"
                              label={prev}
                              variant="outlined"
                              color={statusColor(prev)}
                            />
                            <ArrowForwardIos
                              fontSize="inherit"
                              style={{ opacity: 0.5 }}
                            />
                            <Chip
                              size="small"
                              label={next}
                              color={statusColor(next)}
                              variant="filled"
                            />
                          </Stack>
                        }
                        secondary={
                          <Stack spacing={0.75} mt={1} ml={0.5}>
                            {!!motive && (
                              <Typography
                                variant="body2"
                                sx={{ lineHeight: 1.4 }}
                              >
                                <strong>Motivo:</strong> {motive}
                              </Typography>
                            )}
                            {assigned && assignedMeta && (
                              <Stack spacing={0.5} mt={0.5}>
                                <Typography
                                  variant="body2"
                                  sx={(t) => ({
                                    lineHeight: 1.4,
                                    "& .frag": { marginRight: t.spacing(1) },
                                  })}
                                >
                                  <span className="frag">
                                    <strong>Asignado a:</strong>{" "}
                                    {assignedMeta.usuario}
                                  </span>
                                  <span className="frag">·</span>
                                  <span className="frag">
                                    <strong>Fecha de asignación:</strong>{" "}
                                    {dayjs(assignedMeta.fecha).format(
                                      "DD/MM/YYYY HH:mm"
                                    )}
                                  </span>
                                </Typography>

                                {assignedMeta.codigo && (
                                  <Typography
                                    variant="body2"
                                    title={assignedMeta.codigo}
                                    sx={(t) => ({
                                      color: t.palette.text.primary,
                                      fontFamily:
                                        t.typography.fontFamilyMonospace,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    })}
                                  >
                                    <strong>Código de asignación:</strong>{" "}
                                    {assignedMeta.codigo}
                                  </Typography>
                                )}
                              </Stack>
                            )}

                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              flexWrap="wrap"
                              sx={{
                                "& > *": { fontSize: 12 },
                                color: "text.secondary",
                              }}
                            >
                              <DateText iso={h.fecha_creacion} />
                              <span>·</span>
                              <Tooltip title={`Usuario: ${who}`}>
                                <span>por {who}</span>
                              </Tooltip>
                            </Stack>
                          </Stack>
                        }
                        primaryTypographyProps={{ component: "div" }}
                        secondaryTypographyProps={{ component: "div" }}
                      />
                    </ListItem>
                  );
                })}
              </Box>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2 }}>
        <Box sx={{ flex: 1 }} />
        <TablePagination
          component="div"
          count={pagination.count}
          page={pagination.page - 1}
          rowsPerPage={pagination.pageSize}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangePageSize}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          getItemAriaLabel={(type) =>
            type === "first"
              ? "Primera página"
              : type === "last"
              ? "Última página"
              : type === "next"
              ? "Página siguiente"
              : "Página anterior"
          }
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
