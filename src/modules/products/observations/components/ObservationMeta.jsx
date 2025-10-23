import { Stack, Chip, Tooltip } from "@mui/material";
import {
  ApartmentOutlined,
  CategoryOutlined,
  DevicesOtherOutlined,
  PaidOutlined,
} from "@mui/icons-material";

import { currencyFromDescripcion, formatMoney } from "@/utils/currency";

export default function ObservationMeta({ observation }) {
  const { centrocosto, tipo, subtipo, moneda, costo } = observation ?? {};

  const hasCentro = !!(centrocosto?.codigo || centrocosto?.nombre);
  const hasTipo = !!tipo?.descripcion;
  const hasSubtipo = !!subtipo?.descripcion;
  const hasMonto =
    costo != null &&
    costo !== "" &&
    !Number.isNaN(Number(costo)) &&
    !!moneda?.descripcion;

  const { code } = hasMonto
    ? currencyFromDescripcion(moneda.descripcion)
    : { code: undefined };
  const amount = hasMonto ? formatMoney(costo, code) : null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      flexWrap="wrap"
      sx={{ mt: 0.5 }}
    >
      {hasCentro && (
        <Tooltip
          title={`${centrocosto?.codigo ?? ""} · ${centrocosto?.nombre ?? ""}`}
          placement="top"
        >
          <Chip
            size="small"
            icon={<ApartmentOutlined />}
            variant="outlined"
            label={`${centrocosto?.codigo ?? ""} · ${
              centrocosto?.nombre ?? "—"
            }`}
            sx={{ maxWidth: 280, fontSize: 10 }}
          />
        </Tooltip>
      )}

      {hasTipo && (
        <Chip
          size="small"
          icon={<CategoryOutlined />}
          variant="outlined"
          label={tipo.descripcion}
          sx={{ maxWidth: 280, fontSize: 10 }}
        />
      )}

      {hasSubtipo && (
        <Chip
          size="small"
          icon={<DevicesOtherOutlined />}
          variant="outlined"
          label={subtipo.descripcion}
          sx={{ maxWidth: 280, fontSize: 10 }}
        />
      )}

      {hasMonto && (
        <Chip
          size="small"
          icon={<PaidOutlined />}
          label={amount}
          variant="outlined"
          color="success"
          sx={{ maxWidth: 280, fontSize: 10, fontWeight: 600 }}
        />
      )}
    </Stack>
  );
}
