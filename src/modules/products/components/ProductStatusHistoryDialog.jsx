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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import { useProductStatusHistory } from "../history/hooks/useProductStatusHistory";

dayjs.extend(relativeTime);
dayjs.locale("es");

const statusColor = (desc = "") => {
  const d = desc.toUpperCase().trim();
  if (["DISPONIBLE", "EN STOCK", "ACTIVO"].includes(d)) return "success";
  if (["ASIGNADO", "EN USO"].includes(d)) return "info";
  if (["REPARACIÓN", "MANTENIMIENTO"].includes(d)) return "warning";
  if (["BAJA", "ROBADO", "PERDIDO", "INACTIVO"].includes(d)) return "error";
  return "default";
};

const DateText = ({ iso }) => {
  if (!iso) return <span>—</span>;
  const d = dayjs(iso);
  return (
    <Tooltip title={d.format("DD/MM/YYYY HH:mm")}>
      <span>{d.fromNow()}</span>
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

  const title = useMemo(
    () => `Historial de estados ${productCode ? `· ${productCode}` : ""}`,
    [productCode]
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Encabezado de lista con conteo */}
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

        {/* Estados de carga/errores/empty */}
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

        {/* Lista */}
        {!isLoading && !error && history.length > 0 && (
          <List dense disablePadding>
            {history.map((h, idx) => {
              const prev = h.estado_producto_anterior?.descripcion || "—";
              const next = h.estado_producto_nuevo?.descripcion || "—";
              const who = h.usuario_creacion || "—";
              const motive = h.motivo || "";

              return (
                <ListItem
                  key={h.id ?? idx}
                  divider
                  sx={(t) => ({
                    px: 2,
                    py: 1.25,
                    alignItems: "flex-start",
                    "&:hover": {
                      backgroundColor: alpha(t.palette.primary.main, 0.03),
                    },
                  })}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={(t) => ({
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
                          sx={{ maxWidth: 200 }}
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
                          sx={{ maxWidth: 200 }}
                        />
                      </Stack>
                    }
                    secondary={
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        mt={0.5}
                        flexWrap="wrap"
                        sx={{ "& > *": { fontSize: 12 } }}
                      >
                        <DateText iso={h.fecha_creacion} />
                        <span>·</span>
                        <Tooltip title={`Usuario: ${who}`}>
                          <span>por {who}</span>
                        </Tooltip>
                        {!!motive && (
                          <>
                            <span>·</span>
                            <Chip
                              size="small"
                              variant="outlined"
                              label={motive}
                              sx={{
                                maxWidth: 220,
                                "& .MuiChip-label": {
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                },
                              }}
                            />
                          </>
                        )}
                      </Stack>
                    }
                    primaryTypographyProps={{ component: "div" }}
                    secondaryTypographyProps={{ component: "div" }}
                  />
                </ListItem>
              );
            })}
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
