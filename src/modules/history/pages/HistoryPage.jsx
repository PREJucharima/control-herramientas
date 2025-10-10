import * as React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Chip,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import dayjs from "dayjs";

// Muestra "—" si es null/undefined/empty
const fmt = (v) => (v === null || v === undefined || v === "" ? "—" : v);

// Formatea fecha ISO o string
const fmtDate = (v) => (v ? dayjs(v).format("YYYY-MM-DD HH:mm:ss") : "—");

// Colores simples por estado nuevo (ajusta a tu catálogo si quieres)
const stateColor = (id) => {
  if (id === 2) return "info";
  if (id === 3) return "warning";
  if (id === 5) return "success";
  return "default";
};

// Datos de ejemplo (elimínalos si ya recibes rows por props)
const MOCK_ROWS = [
  {
    id: 1,
    producto_id: 1,
    estado_producto_anterior_id: null,
    estado_producto_nuevo_id: 2,
    motivo: "Estado inicial",
    usuario_modificacion: "jucharima",
    fecha_modificacion: "2025-10-07 17:06:03",
  },
  {
    id: 2,
    producto_id: 2,
    estado_producto_anterior_id: null,
    estado_producto_nuevo_id: 2,
    motivo: "Estado inicial",
    usuario_modificacion: "jucharima",
    fecha_modificacion: "2025-10-08 11:48:24",
  },
  {
    id: 3,
    producto_id: 3,
    estado_producto_anterior_id: null,
    estado_producto_nuevo_id: 2,
    motivo: "Estado inicial",
    usuario_modificacion: "jucharima",
    fecha_modificacion: "2025-10-08 11:48:24",
  },
  {
    id: 4,
    producto_id: 4,
    estado_producto_anterior_id: null,
    estado_producto_nuevo_id: 2,
    motivo: "Estado inicial",
    usuario_modificacion: "jucharima",
    fecha_modificacion: "2025-10-08 11:48:24",
  },
  {
    id: 5,
    producto_id: 5,
    estado_producto_anterior_id: null,
    estado_producto_nuevo_id: 2,
    motivo: "Estado inicial",
    usuario_modificacion: "jucharima",
    fecha_modificacion: "2025-10-08 11:48:24",
  },
  {
    id: 6,
    producto_id: 6,
    estado_producto_anterior_id: null,
    estado_producto_nuevo_id: 2,
    motivo: "Estado inicial",
    usuario_modificacion: "jucharima",
    fecha_modificacion: "2025-10-08 11:48:24",
  },
  {
    id: 7,
    producto_id: 7,
    estado_producto_anterior_id: null,
    estado_producto_nuevo_id: 3,
    motivo: "Estado inicial",
    usuario_modificacion: "jucharima",
    fecha_modificacion: "2025-10-09 18:53:55",
  },
  {
    id: 8,
    producto_id: 8,
    estado_producto_anterior_id: null,
    estado_producto_nuevo_id: 5,
    motivo: "Estado inicial",
    usuario_modificacion: "jucharima",
    fecha_modificacion: "2025-10-09 19:08:13",
  },
];

export default function HistoryTable({
  rows = MOCK_ROWS,
  title = "Historial de estado",
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Toolbar sx={{ gap: 1, px: 2 }}>
        <HistoryIcon fontSize="small" color="action" />
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
      </Toolbar>
      <Divider />
      <TableContainer sx={{ maxHeight: 420 }}>
        <Table stickyHeader size="small" aria-label="tabla-historial">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Estado anterior</TableCell>
              <TableCell>Estado nuevo</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Fecha modificación</TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              // zebra stripes
              "& tr:nth-of-type(2n)": {
                backgroundColor: (t) => t.palette.action.hover,
              },
            }}
          >
            {rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontVariantNumeric: "tabular-nums" }}>
                  {fmt(r.id)}
                </TableCell>
                <TableCell sx={{ fontVariantNumeric: "tabular-nums" }}>
                  {fmt(r.producto_id)}
                </TableCell>

                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={fmt(r.estado_producto_anterior_id)}
                      color="default"
                    />
                    <ArrowRightAltIcon fontSize="small" />
                    <Chip
                      size="small"
                      label={fmt(r.estado_producto_nuevo_id)}
                      color={stateColor(r.estado_producto_nuevo_id)}
                      variant="filled"
                    />
                  </Stack>
                </TableCell>

                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  {/* Columna espejo opcional para facilitar lectura en pantallas pequeñas */}
                  <Chip
                    size="small"
                    label={fmt(r.estado_producto_nuevo_id)}
                    color={stateColor(r.estado_producto_nuevo_id)}
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  <Tooltip title={fmt(r.motivo)}>
                    <Box
                      sx={{
                        maxWidth: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmt(r.motivo)}
                    </Box>
                  </Tooltip>
                </TableCell>

                <TableCell>{fmt(r.usuario_modificacion)}</TableCell>
                <TableCell
                  sx={{
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fmtDate(r.fecha_modificacion)}
                </TableCell>
              </TableRow>
            ))}

            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 6, color: "text.secondary" }}
                >
                  No hay registros de historial.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
