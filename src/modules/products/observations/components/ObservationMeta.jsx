import { Stack, Chip, Tooltip } from "@mui/material";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import DevicesOtherOutlined from "@mui/icons-material/DevicesOtherOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";

import { currencyFromDescripcion, formatMoney } from "@/utils/currency";

export default function ObservationMeta({ observation }) {
  const { centrocosto, tipo, subtipo, moneda, costo } = observation ?? {};
  const { code } = currencyFromDescripcion(moneda?.descripcion || "");
  const amount = formatMoney(costo, code);

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      flexWrap="wrap"
      sx={{ mt: 0.5 }}
    >
      <Tooltip
        title={`${centrocosto?.codigo ?? ""} · ${centrocosto?.nombre ?? ""}`}
        placement="top"
      >
        <Chip
          size="small"
          icon={<ApartmentOutlined />}
          variant="outlined"
          label={
            centrocosto
              ? `${centrocosto.codigo ?? ""} · ${centrocosto.nombre ?? "—"}`
              : "—"
          }
          sx={{ maxWidth: 280, fontSize: 10 }}
        />
      </Tooltip>

      <Chip
        size="small"
        icon={<CategoryOutlined />}
        variant="outlined"
        label={tipo?.descripcion ?? "—"}
        sx={{ maxWidth: 280, fontSize: 10 }}
      />

      {!!subtipo?.descripcion && (
        <Chip
          size="small"
          icon={<DevicesOtherOutlined />}
          variant="outlined"
          label={subtipo.descripcion}
          sx={{ maxWidth: 280, fontSize: 10 }}
        />
      )}

      <Chip
        size="small"
        icon={<PaidOutlined />}
        label={amount}
        variant="outlined"
        color="success"
        sx={{ maxWidth: 280, fontSize: 10, fontWeight: 600 }}
      />
    </Stack>
  );
}
