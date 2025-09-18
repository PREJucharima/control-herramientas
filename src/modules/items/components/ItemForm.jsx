import * as Yup from "yup";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// MUI
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// RHF wrappers
import {
  FormProvider,
  TextField,
  DatePicker,
  SelectField,
} from "@/components/form";

const toISODate = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : null);

export default function ItemForm({
  initialItem,
  itemsByMaestro,
  isLoadingItemsByMaestro,
  typeCatalog,
  onCancel,
  onSubmit,
}) {
  const initialValues = {
    item_padre_id: initialItem?.item_padre_id ?? "",
    item_padre: initialItem?.item_padre ?? "",
    descripcion: initialItem?.descripcion ?? "",
    descripcion_corta: initialItem?.descripcion_corta ?? "",
    esta_activo: initialItem?.esta_activo ?? true,
    fecha_inicio_vigencia: initialItem?.fecha_inicio_vigencia
      ? dayjs(initialItem.fecha_inicio_vigencia).toDate()
      : null,
    fecha_fin_vigencia: initialItem?.fecha_fin_vigencia
      ? dayjs(initialItem.fecha_fin_vigencia).toDate()
      : null,
  };

  const normalizeDate = (curr, orig) =>
    orig === "" || orig === "null" || orig == null ? null : curr;

  const validationSchema = Yup.object({
    item_padre_id: Yup.number()
      .nullable()
      .transform((v, orig) => (orig === "" ? null : v))
      .typeError("Debe ser numérico"),
    item_padre: Yup.number()
      .nullable()
      .transform((v, orig) => (orig === "" ? null : v))
      .typeError("Debe ser numérico"),
    descripcion: Yup.string().trim().required("La descripción es requerida"),
    descripcion_corta: Yup.string().trim().nullable(),
    esta_activo: Yup.boolean().required(),
    fecha_inicio_vigencia: Yup.date()
      .transform(normalizeDate)
      .nullable()
      .typeError("Fecha inválida"),
    fecha_fin_vigencia: Yup.date()
      .transform(normalizeDate)
      .nullable()
      .typeError("Fecha inválida")
      .when("fecha_inicio_vigencia", ([inicio], schema) => {
        if (inicio && dayjs(inicio).isValid()) {
          return schema.min(inicio, "Fin debe ser posterior al inicio");
        }
        return schema;
      }),
  });

  const hasShowInputsDads = typeCatalog?.depende_de_catalogo != null;

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: "onTouched",
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid, isDirty },
    control,
    setValue,
  } = methods;

  const onSubmitInternal = handleSubmit(async (values) => {
    const payload = {
      item_padre_id:
        values.item_padre_id === "" ? null : Number(values.item_padre_id),
      item_padre: values.item_padre === "" ? null : Number(values.item_padre),
      descripcion: values.descripcion.trim(),
      descripcion_corta: values.descripcion_corta?.trim() || null,
      esta_activo: !!values.esta_activo,
      fecha_inicio_vigencia: toISODate(values.fecha_inicio_vigencia),
      fecha_fin_vigencia: toISODate(values.fecha_fin_vigencia),
    };

    if (onSubmit) await onSubmit(payload);
    else console.log("POST /api/catalogos/:codigo/items", payload);
  });

  const title = initialItem ? "Editar ítem" : "Nuevo ítem";
  const subheader = initialItem
    ? "Modifica los datos del ítem seleccionado."
    : "Completa los campos requeridos para crear un nuevo ítem.";

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
            <Tooltip title="Los campos con * son obligatorios">
              <InfoOutlinedIcon fontSize="small" color="action" />
            </Tooltip>
          </Stack>
        }
        subheader={subheader}
      />

      <Divider />

      <FormProvider methods={methods} onSubmit={onSubmitInternal}>
        <CardContent>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="descripcion"
                label="Descripción *"
                placeholder="Ej. Contrato anual de servicio"
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="descripcion_corta"
                label="Descripción corta"
                placeholder="Resumen visible en listados"
                fullWidth
              />
            </Grid>

            {hasShowInputsDads && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <SelectField
                  name="item_padre"
                  label="Ítem Padre"
                  options={itemsByMaestro}
                  loading={isLoadingItemsByMaestro}
                  allowEmpty
                  emptyLabel="— Ninguno —"
                />
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name="esta_activo"
                render={({ field }) => (
                  <Stack>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!field.value}
                          onChange={(_, v) => field.onChange(v)}
                          inputProps={{ "aria-label": "Marcar ítem activo" }}
                        />
                      }
                      label="Activo"
                    />
                    <FormHelperText sx={{ ml: 1.5, mt: -1 }}>
                      Si está desactivado, no se mostrará en flujos de
                      selección.
                    </FormHelperText>
                  </Stack>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <DatePicker
                  name="fecha_inicio_vigencia"
                  label="Inicio vigencia"
                />
                <Tooltip title="Quitar fecha de inicio">
                  <span>
                    <IconButton
                      aria-label="Quitar fecha inicio"
                      onClick={() =>
                        setValue("fecha_inicio_vigencia", null, {
                          shouldDirty: true,
                        })
                      }
                      size="small"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <DatePicker name="fecha_fin_vigencia" label="Fin vigencia" />
                <Tooltip title="Quitar fecha de fin">
                  <span>
                    <IconButton
                      aria-label="Quitar fecha fin"
                      onClick={() =>
                        setValue("fecha_fin_vigencia", null, {
                          shouldDirty: true,
                        })
                      }
                      size="small"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardActions sx={{ p: 2, justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isDirty || !isValid}
          >
            Guardar
          </Button>
        </CardActions>
      </FormProvider>
    </Card>
  );
}
