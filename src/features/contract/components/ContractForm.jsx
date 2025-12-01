import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

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
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { useBranches } from "../../branches/hooks/useBranches";

const toISODate = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : null);

export default function ContractForm({
  initialContract,
  companies,
  defaultCompany,
  isLoadingCompanies,
  errorCompanies,
  categories,
  isLoadingCategories,
  errorCategories,
  onSubmit,
  onCancel,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const initialValues = {
    empresa: initialContract?.empresa ?? null,
    sucursal: initialContract?.sucursal ?? null,
    categoria: initialContract?.categoria ?? null,
    descripcion: initialContract?.descripcion ?? "",
    esta_activo: initialContract?.esta_activo ?? true,
    fecha_inicio_vigencia: initialContract?.fecha_inicio_vigencia
      ? dayjs(initialContract.fecha_inicio_vigencia).toDate()
      : null,
    fecha_fin_vigencia: initialContract?.fecha_fin_vigencia
      ? dayjs(initialContract.fecha_fin_vigencia).toDate()
      : null,
  };

  const normalizeDate = (curr, orig) =>
    orig === "" || orig === "null" || orig == null ? null : curr;

  const validationSchema = useMemo(() => {
    const areFechasRequired = true;

    return Yup.object({
      descripcion: Yup.string().trim().required("La descripción es requerida"),
      esta_activo: Yup.boolean().required(),

      fecha_inicio_vigencia: Yup.date()
        .transform(normalizeDate)
        .nullable()
        .typeError("Fecha inválida")
        .when([], {
          is: () => areFechasRequired,
          then: (schema) => schema.required("La fecha de inicio es requerida"),
          otherwise: (schema) => schema.nullable(),
        }),

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
  }, []);

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

  /* Selección de sucursales según la empresa seleccionada */
  const selectedCompany = useWatch({ control, name: "empresa" });
  const prevCompanyId = useRef();
  const {
    branchesLookup: branches,
    isLoading: isLoadingBranches,
    error: errorBranches,
  } = useBranches(selectedCompany?.id);

  useEffect(() => {
    if (!initialContract && defaultCompany) {
      const companyToSet = companies.find((c) => c.id === defaultCompany.id);
      if (companyToSet) {
        setValue("empresa", companyToSet, { shouldValidate: false });
      }
    }
  }, [initialContract, defaultCompany, companies, setValue]);

  useEffect(() => {
    if (
      prevCompanyId.current != null &&
      selectedCompany?.id !== prevCompanyId.current
    ) {
      setValue("sucursal", null, { shouldValidate: true, shouldDirty: true });
    }
    prevCompanyId.current = selectedCompany?.id ?? null;
  }, [selectedCompany?.id, setValue]);

  const onSubmitInternal = handleSubmit(async (values) => {
    const payload = {
      empresa: values.empresa ? values.empresa.id : null,
      sucursal: values.sucursal ? values.sucursal.id : null,
      categoria: values.categoria ? values.categoria.id : null,
      descripcion: values.descripcion.trim(),
      esta_activo: !!values.esta_activo,
      fecha_inicio_vigencia: toISODate(values.fecha_inicio_vigencia),
      fecha_fin_vigencia: toISODate(values.fecha_fin_vigencia),
    };

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

  const title = initialContract ? "Editar contrato" : "Nuevo contrato";
  const subheader = initialContract
    ? "Modifica los datos del contrato seleccionado."
    : "Completa los campos requeridos para crear un nuevo contrato.";

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
          onSubmit={handleSubmit(onSubmitInternal)}
        >
          <CardContent>
            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <AutocompleteController
                  name="empresa"
                  control={control}
                  label="Empresa"
                  options={companies}
                  isLoading={isLoadingCompanies}
                  fetchError={errorCompanies}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <AutocompleteController
                  name="sucursal"
                  control={control}
                  label="Sucursal"
                  options={branches}
                  isLoading={isLoadingBranches}
                  fetchError={errorBranches}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <AutocompleteController
                  name="categoria"
                  control={control}
                  label="Categoría"
                  options={categories}
                  isLoading={isLoadingCategories}
                  fetchError={errorCategories}
                />
              </Grid>
            </Grid>

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
                    label={`Inicio de vigencia *`}
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
                    label={`Fin de vigencia *`}
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
              disabled={isSubmitting || !isDirty || !isValid}
            >
              Guardar
            </Button>
          </CardActions>
        </FormProvider>
      </Card>

      <ConfirmationDialog
        open={confirmOpen}
        title={`${
          initialContract ? "Confirmar Cambios" : "Crear nuevo items"
        } `}
        content={`${
          initialContract
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
