import * as Yup from "yup";
import { useEffect, useRef } from "react";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Stack,
  Divider,
  Typography,
  Tooltip,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

import { useCentroCostos } from "@/modules/centros-costo/hooks/useCentroCostos";

export default function EmployeeForm({
  initialEmpleado,
  companies = [],
  isLoadingCompanies,
  onSubmit,
  onCancel,
  defaultCompany,
}) {
  // ---------- Valores iniciales ----------
  const initialValues = {
    rut: initialEmpleado?.rut ?? "",
    email: initialEmpleado?.email ?? "",
    nombre: initialEmpleado?.nombre ?? "",
    apellido_paterno: initialEmpleado?.apellido_paterno ?? "",
    apellido_materno: initialEmpleado?.apellido_materno ?? "",
    nombre_completo: initialEmpleado?.nombre_completo ?? "",
    empresa: initialEmpleado?.empresa ?? null,
    centrocosto: initialEmpleado?.centrocosto ?? null,
    esta_activo: initialEmpleado?.esta_activo ?? "",
  };

  // ---------- Validación ----------
  const validationSchema = Yup.object({
    rut: Yup.string().trim().required("El RUT es requerido"),
    email: Yup.string()
      .trim()
      .email("Email inválido")
      .required("El email es requerido"),
    nombre: Yup.string().trim().required("El nombre es requerido"),
    apellido_paterno: Yup.string()
      .trim()
      .required("El apellido paterno es requerido"),
    apellido_materno: Yup.string()
      .trim()
      .required("El apellido materno es requerido"),
    nombre_completo: Yup.string()
      .trim()
      .required("El nombre completo es requerido"),
    empresa: Yup.object().nullable().required("La empresa es requerida"),
    centrocosto: Yup.mixed().required("El centro de costo es requerido"),
  });

  // ---------- RHF ----------
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const { control, handleSubmit, setValue, formState } = methods;
  const { isSubmitting, isDirty, isValid } = formState;

  // Autocompletar nombre_completo
  const nombre = useWatch({ control, name: "nombre" });
  const apPat = useWatch({ control, name: "apellido_paterno" });
  const apMat = useWatch({ control, name: "apellido_materno" });

  useEffect(() => {
    setValue(
      "nombre_completo",
      [nombre, apPat, apMat].filter(Boolean).join(" "),
      {
        shouldValidate: false,
        shouldDirty: false,
      }
    );
  }, [nombre, apPat, apMat, setValue]);

  // Lookups dependientes
  const selectedCompany = useWatch({ control, name: "empresa" });
  const { centroCostosLookup, isLoading: isLoadingCentrosCosto } =
    useCentroCostos(selectedCompany?.id);

  // Usamos una referencia para "recordar" el ID de la empresa anterior
  const prevCompanyId = useRef();

  useEffect(() => {
    if (!initialEmpleado && defaultCompany) {
      const companyToSet = companies.find((c) => c.id === defaultCompany.id);
      if (companyToSet) {
        setValue("empresa", companyToSet, { shouldValidate: false });
      }
    }
  }, [initialEmpleado, defaultCompany, companies, setValue]);

  useEffect(() => {
    if (isDirty && selectedCompany?.id !== prevCompanyId.current) {
      setValue("centrocosto", null, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
    prevCompanyId.current = selectedCompany?.id;
  }, [selectedCompany, setValue, isDirty]);

  // ---------- Submit ----------
  const onSubmitInternal = handleSubmit(async (values) => {
    const nombreCompleto =
      (values.nombre_completo && values.nombre_completo.trim()) ||
      [values.nombre, values.apellido_paterno, values.apellido_materno]
        .filter(Boolean)
        .join(" ")
        .trim();

    const payload = {
      rut: values.rut.trim(),
      email: values.email.trim(),
      nombre: values.nombre.trim(),
      apellido_paterno: values.apellido_paterno.trim(),
      apellido_materno: values.apellido_materno?.trim() || "",
      nombre_completo: nombreCompleto,
      empresa: values.empresa ? values.empresa.id : null,
      centrocosto: values.centrocosto ? values.centrocosto.id : null,
      ...(initialEmpleado && { esta_activo: !!values.esta_activo }),
    };

    console.log("payload", payload);
    await onSubmit?.(payload);
  });

  const title = initialEmpleado ? "Editar empleado" : "Nuevo empleado";
  const subheader = initialEmpleado
    ? "Modifica los datos del empleado seleccionado."
    : "Completa los campos requeridos para crear un nuevo empleado.";

  const renderAC = (name, label, options, disabled) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Autocomplete
          key={
            name === "centrocosto"
              ? `cc-${selectedCompany?.id ?? "none"}`
              : name
          }
          options={options || []}
          value={field.value}
          onChange={(_, val) => field.onChange(val)}
          onBlur={field.onBlur}
          disabled={!!disabled}
          sx={{ minWidth: 400, mt: -1 }}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          getOptionLabel={(o) =>
            o?.descripcion ? o.descripcion : o?.nombre ?? ""
          }
          size="medium"
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
      )}
    />
  );

  return (
    <Card sx={{ borderRadius: 3, maxWidth: 850, mx: "auto" }}>
      <CardHeader
        title={
          <Stack direction="row" aligns="center" gap={1}>
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

      <FormProvider {...methods}>
        <form onSubmit={onSubmitInternal} noValidate>
          <CardContent>
            <Grid container spacing={4} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="rut"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="RUT *"
                      placeholder="12.345.678-9"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Nombre *"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="apellido_paterno"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Apellido paterno *"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="apellido_materno"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Apellido materno *"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Email *"
                      placeholder="correo@empresa.com"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="nombre_completo"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Nombre completo *"
                      helperText={
                        fieldState.error?.message ||
                        "Se genera automáticamente a partir del nombre y apellidos."
                      }
                      fullWidth
                    />
                  )}
                  disabled
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "empresa",
                  "Empresa *",
                  companies,
                  isLoadingCompanies
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "centrocosto",
                  "Centro de costo *",
                  centroCostosLookup,
                  !selectedCompany?.id || isLoadingCentrosCosto
                )}
              </Grid>

              {initialEmpleado && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="esta_activo"
                    control={control}
                    render={({ field }) => (
                      <Stack>
                        <FormControlLabel
                          sx={{ ml: 0.5 }}
                          control={
                            <Switch
                              checked={!!field.value}
                              onChange={(_, v) => field.onChange(v)}
                            />
                          }
                          label="Activo"
                        />
                        <FormHelperText sx={{ ml: 1.5, mt: 0 }}>
                          Si está desactivado, el empleado no aparecerá en
                          flujos de selección.
                        </FormHelperText>
                      </Stack>
                    )}
                  />
                </Grid>
              )}
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
              disabled={isSubmitting || !isDirty || !isValid}
            >
              {initialEmpleado ? "Guardar cambios" : "Crear empleado"}
            </Button>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
}
