import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { FormProvider, TextField, SelectField } from "@/components/form";

export default function MaestroForm({
  initialMaestro,
  maestros,
  isLoadingMaestros,
  onCancel,
  onSubmit,
}) {
  const initialValues = {
    nombre: initialMaestro?.nombre ?? "",
    usa_descripcion_corta: initialMaestro?.usa_descripcion_corta ?? false,
    usa_fechas_vigencia: initialMaestro?.usa_fechas_vigencia ?? false,
    esta_activo: initialMaestro?.esta_activo ?? true,
    depende_de_maestro: initialMaestro?.depende_de_maestro ?? null,
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().trim().required("El nombre es requerido"),
    usa_descripcion_corta: Yup.boolean().required(),
    usa_fechas_vigencia: Yup.boolean().required(),
    esta_activo: Yup.boolean().required(),
    depende_de_maestro: Yup.number().nullable().typeError("Debe ser numérico"),
  });

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
  } = methods;

  const onSubmitInternal = handleSubmit(async (values) => {
    const payload = {
      nombre: values.nombre.trim(),
      usa_descripcion_corta: !!values.usa_descripcion_corta,
      usa_fechas_vigencia: !!values.usa_fechas_vigencia,
      esta_activo: !!values.esta_activo,
      depende_de_maestro: values.depende_de_maestro
        ? Number(values.depende_de_maestro)
        : null,
    };

    if (onSubmit) await onSubmit(payload);
    else console.log("POST /api/catalogos/definiciones/", payload);
  });

  const title = initialMaestro ? "Editar maestro" : "Nuevo maestro";
  const subheader = initialMaestro
    ? "Modifica los datos del maestro seleccionado."
    : "Completa los campos requeridos para crear un nuevo maestro.";

  return (
    <Card sx={{ borderRadius: 3, maxWidth: 900, margin: "0 auto" }}>
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
                name="nombre"
                label="Nombre del catálogo *"
                placeholder="Ej. Contratos"
                fullWidth
                inputProps={{ "aria-label": "Nombre del catálogo" }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name="usa_descripcion_corta"
                render={({ field }) => (
                  <Stack>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!field.value}
                          onChange={(_, v) => field.onChange(v)}
                          inputProps={{
                            "aria-label":
                              "Marcar maestro si uso descripción corta",
                          }}
                        />
                      }
                      label="Usa descripción corta"
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
              <Controller
                control={control}
                name="usa_fechas_vigencia"
                render={({ field }) => (
                  <Stack>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!field.value}
                          onChange={(_, v) => field.onChange(v)}
                          inputProps={{
                            "aria-label":
                              "Marcar maestro si usa fechas de vigencia",
                          }}
                        />
                      }
                      label="Usa fechas de vigencia"
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
              <SelectField
                name="depende_de_maestro"
                label="Depende de catálogo"
                loading={isLoadingMaestros}
                options={maestros || []}
                valueKey="id"
                labelKey="nombre"
                allowEmpty
                emptyLabel="— Ninguno —"
              />
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
