import { Controller, useForm } from "react-hook-form";

import * as Yup from "yup";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { Clear, InfoOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AutocompleteController,
  DatePicker,
  FormProvider,
  TextField,
} from "@/components/common/form";
import { useFetchItemsByMaestro } from "../hooks/useFetchItemsByMaestro";
import { useFetchMaestros } from "../../masters/hooks/useFetchMaestros";
import { useMemo, useState } from "react";
import { ConfirmationDialog } from "../../../components/ConfirmationDialog";

const toISODate = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : null);

export default function ItemForm({ initialItem, codigo, onCancel, onSubmit }) {
  const { maestros } = useFetchMaestros();
  const maestroActual = maestros?.find((m) => m.codigo_unico === codigo);
  const dependeDeCatalogo = maestroActual?.depende_de_maestro?.id;
  const {
    itemsByMaestro,
    isLoading: isLoadingItemsByMaestro,
    error: errorItemsByMaestro,
  } = useFetchItemsByMaestro(dependeDeCatalogo);

  console.log("Maestro actual:", maestroActual);
  console.log("Depende de catálogo:", dependeDeCatalogo);
  console.log("Items by maestro (lookup):", itemsByMaestro);

  const hasShowInputsDads = maestroActual?.depende_de_maestro != null;

  console.log("Tiene item padre:", hasShowInputsDads);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const initialValues = {
    descripcion: initialItem?.descripcion ?? "",
    descripcion_corta: initialItem?.descripcion_corta ?? "",
    item_padre: initialItem?.item_padre ?? null,
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

  const validationSchema = useMemo(() => {
    const isDescCortaRequired = maestroActual?.usa_descripcion_corta === true;
    const areFechasRequired = maestroActual?.usa_fechas_vigencia === true;

    return Yup.object({
      descripcion: Yup.string().trim().required("La descripción es requerida"),

      // --- CAMPO CONDICIONAL: descripcion_corta ---
      descripcion_corta: Yup.string()
        .trim()
        .nullable()
        .when([], {
          is: () => isDescCortaRequired,
          then: (schema) =>
            schema.required("La descripción corta es requerida"),
          otherwise: (schema) => schema.nullable(),
        }),

      // --- CAMPO CONDICIONAL: item_padre ---
      item_padre: Yup.object()
        .nullable()
        .transform((value, originalValue) =>
          String(originalValue).trim() === "" ? null : value
        ),

      esta_activo: Yup.boolean().required(),

      // --- CAMPO CONDICIONAL: fecha_inicio_vigencia ---
      fecha_inicio_vigencia: Yup.date()
        .transform(normalizeDate)
        .nullable()
        .typeError("Fecha inválida")
        .when([], {
          is: () => areFechasRequired,
          then: (schema) => schema.required("La fecha de inicio es requerida"),
          otherwise: (schema) => schema.nullable(),
        }),

      // --- CAMPO CONDICIONAL: fecha_fin_vigencia ---
      fecha_fin_vigencia: Yup.date()
        .transform(normalizeDate)
        .nullable()
        .typeError("Fecha inválida")
        .when("fecha_inicio_vigencia", ([inicio], schema) => {
          let baseSchema =
            inicio && dayjs(inicio).isValid()
              ? schema.min(inicio, "Fin debe ser posterior al inicio")
              : schema;

          if (areFechasRequired) {
            return baseSchema.required("La fecha de fin es requerida");
          }
          return baseSchema.nullable();
        }),
    });
  }, [maestroActual]);

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
      descripcion: values.descripcion.trim(),
      item_padre: values.item_padre ? values.item_padre.id : null,
      descripcion_corta: values.descripcion_corta?.trim() || null,
      esta_activo: !!values.esta_activo,
      fecha_inicio_vigencia: toISODate(values.fecha_inicio_vigencia),
      fecha_fin_vigencia: toISODate(values.fecha_fin_vigencia),
    };

    // if (onSubmit) await onSubmit(payload);
    // else console.log("POST /api/catalogos/:codigo/items", payload);

    setFormData(payload); // Guarda el payload listo para enviar
    setConfirmOpen(true); // Abre el modal
  });

  const handleConfirmSubmit = async () => {
    if (!formData) return;

    // Llama a la función onSubmit original
    if (onSubmit) {
      await onSubmit(formData);
    }

    setConfirmOpen(false); // Cierra el modal
    setFormData(null); // Limpia los datos
  };

  const handleCancelSubmit = () => {
    setConfirmOpen(false);
    setFormData(null);
  };

  const title = initialItem ? "Editar ítem" : "Nuevo ítem";
  const subheader = initialItem
    ? "Modifica los datos del ítem seleccionado."
    : "Completa los campos requeridos para crear un nuevo ítem.";

  return (
    <>
      <Card sx={{ borderRadius: 3, maxWidth: 850, mx: "auto" }}>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography variant="h6" fontWeight={700}>
                {title}
              </Typography>
              <Tooltip title="Los campos con * son obligatorios">
                <InfoOutlined fontSize="small" color="action" />
              </Tooltip>
            </Stack>
          }
          subheader={subheader}
        />

        <Divider />

        <FormProvider
          methods={methods}
          // onSubmit={onSubmitInternal}
          onSubmit={handleSubmit(onSubmitInternal)}
        >
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
                  label={`Descripción corta ${
                    maestroActual?.usa_descripcion_corta ? "*" : ""
                  }`}
                  placeholder="Resumen visible en listados"
                  fullWidth
                />
              </Grid>

              {hasShowInputsDads && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AutocompleteController
                    name="item_padre"
                    control={control}
                    label="Ítem Padre"
                    options={itemsByMaestro}
                    isLoading={isLoadingItemsByMaestro}
                    fetchError={errorItemsByMaestro}
                    required={false}
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
                            slotProps={{
                              input: {
                                "aria-label": "Marcar ítem activo",
                              },
                            }}
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
                    label={`Inicio de vigencia ${
                      maestroActual?.usa_fechas_vigencia ? "*" : ""
                    }`}
                    control={control}
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
                        <Clear fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <DatePicker
                    name="fecha_fin_vigencia"
                    label={`Fin de vigencia ${
                      maestroActual?.usa_fechas_vigencia ? "*" : ""
                    }`}
                    control={control}
                  />
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
                        <Clear fontSize="small" />
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
              // loading={isSubmitting}
              disabled={isSubmitting || !isDirty || !isValid}
            >
              Guardar
            </Button>
          </CardActions>
        </FormProvider>
      </Card>

      <ConfirmationDialog
        open={confirmOpen}
        title={`${initialItem ? "Confirmar Cambios" : "Crear nuevo items"} `}
        content={`${
          initialItem
            ? "¿Estás seguro de que deseas guardar los cambios en este ítem?"
            : "¿Estás seguro de que deseas crear este nuevo ítem?"
        }`}
        onClose={handleCancelSubmit}
        onConfirm={handleConfirmSubmit}
        isLoading={isSubmitting}
        confirmText="Confirmar"
      />
    </>
  );
}
