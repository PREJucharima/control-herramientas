import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Stack,
  Button,
  Collapse,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
  TextField,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

import { useFetchItemsByMaestro } from "@/modules/items/hooks/useFetchItemsByMaestro";
import { AutocompleteController } from "@/components/form";
import { useCatalogChildren } from "../../hooks/useCatalogChildren";
import { MAESTROS } from "../../constants/product.constants";
import { useCentroCostos } from "../../../centros-costo/hooks/useCentroCostos";

const schema = yup.object({
  observacion: yup
    .string()
    .trim()
    .required("Escribe una observación")
    .min(3, "La observación es muy corta"),
  costo: yup
    .number()
    .typeError("Costo debe ser numérico")
    .min(0, "No puede ser negativo")
    .nullable()
    .transform((v, orig) => (orig === "" ? null : v)),
  tipo: yup.mixed().nullable(),
  subtipo: yup.mixed().nullable(),
  moneda: yup.mixed().nullable(),
  centrocosto: yup.mixed().nullable(),
});

export function ObservationForm({
  productCode,
  onSubmit,
  defaultCompany,
  defaultCostCenter = null,
  // === NUEVO ===
  isEditing = false,
  editingData = null,
  loadingEditing = false,
  onCancelEdit,
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const methods = useForm({
    defaultValues: {
      observacion: "",
      costo: null,
      tipo: null,
      subtipo: null,
      moneda: null,
      centrocosto: defaultCostCenter,
      _showAdvanced: false,
    },
    resolver: yupResolver(schema),
    mode: "onBlur",
    criteriaMode: "all",
    shouldUnregister: false, // mantiene campos registrados aunque se colapsen
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    reset,
    watch,
  } = methods;

  const showAdvanced = useWatch({ control, name: "_showAdvanced" });
  const showAdvancedResponsive = isDesktop || showAdvanced;

  useEffect(() => {
    if (isDesktop) {
      setValue("_showAdvanced", true, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [isDesktop, setValue]);

  // Lookups
  const {
    itemsByMaestro: currencyOptions,
    isLoading: isCurrencyLoading,
    error: currencyError,
  } = useFetchItemsByMaestro(MAESTROS.CURRENCY);

  const {
    itemsByMaestro: typeOptions,
    isLoading: isTypeLoading,
    error: typeError,
  } = useFetchItemsByMaestro(MAESTROS.TYPE);

  const selectedType = useWatch({ control, name: "tipo" });
  const prevTypeId = useRef();

  const {
    childItems: subTypeOptions,
    isLoading: isSubTypeLoading,
    error: subTypeError,
  } = useCatalogChildren(selectedType?.id ?? null);

  useEffect(() => {
    if (prevTypeId.current != null && selectedType?.id !== prevTypeId.current) {
      setValue("subtipo", null, { shouldValidate: true, shouldDirty: true });
    }
    prevTypeId.current = selectedType?.id ?? null;
  }, [selectedType?.id, setValue]);

  const {
    centroCostosLookup,
    isLoading: isLoadingCentrosCosto,
    error: centrosCostoError,
  } = useCentroCostos(defaultCompany?.id);

  // ====== HIDRATACIÓN EN MODO EDICIÓN ======
  const byId = (arr, id) => (arr || []).find((o) => o?.id === id) ?? null;

  // 1) Setear base cuando llegan datos + lookups base
  useEffect(() => {
    if (!isEditing || !editingData) return;

    const baseValues = {
      observacion: editingData.observacion ?? "",
      costo: editingData.costo != null ? Number(editingData.costo) : null,
      moneda: byId(currencyOptions, editingData.moneda),
      centrocosto: byId(centroCostosLookup, editingData.centrocosto),
      tipo: byId(typeOptions, editingData.tipo),
      subtipo: null, // se define luego cuando cargue el catálogo de subtipos
      _showAdvanced: true,
    };

    reset(baseValues, { keepDefaultValues: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEditing,
    editingData,
    currencyOptions,
    centroCostosLookup,
    typeOptions,
  ]);

  // 2) Cuando ya hay tipo y cargaron los subtipos, setear subtipo
  useEffect(() => {
    if (!isEditing || !editingData) return;
    if (!selectedType?.id) return;
    if (!(subTypeOptions?.length > 0)) return;

    const match = byId(subTypeOptions, editingData.subtipo);
    setValue("subtipo", match, { shouldDirty: false, shouldValidate: true });
  }, [isEditing, editingData, selectedType?.id, subTypeOptions, setValue]);

  // Envío
  const observacion = watch("observacion");
  const canAttemptSend = useMemo(
    () =>
      (observacion ?? "").trim().length >= 3 &&
      !isSubmitting &&
      !loadingEditing,
    [observacion, isSubmitting, loadingEditing]
  );

  const buildPayload = useCallback(
    (values) => ({
      producto_codigo: productCode,
      observacion: (values.observacion ?? "").trim(),
      costo: values.costo != null ? String(values.costo) : null,
      tipo: values.tipo?.id ?? 0,
      subtipo: values.subtipo?.id ?? 0,
      moneda: values.moneda?.id ?? 0,
      centrocosto: values.centrocosto?.id ?? 0,
    }),
    [productCode]
  );

  const onSubmitInternal = handleSubmit(async (values) => {
    const payload = buildPayload(values);
    await onSubmit?.(payload);

    // Si estabas editando, deja los valores (el padre cerrará el modo edición).
    if (!isEditing) {
      reset(
        {
          ...values,
          observacion: "",
          costo: null,
          subtipo: null,
          _showAdvanced: isDesktop ? true : showAdvanced,
        },
        { keepDefaultValues: false }
      );
    }
  });

  // Reset a estado inicial (modo crear)
  const handleClear = () => {
    reset(
      {
        observacion: "",
        costo: null,
        tipo: null,
        subtipo: null,
        moneda: null,
        centrocosto: defaultCostCenter ?? null,
        _showAdvanced: isDesktop ? true : showAdvanced,
      },
      { keepDefaultValues: false }
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmitInternal} noValidate>
        {/* Composer */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Controller
            name="observacion"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                placeholder="Escribe una observación..."
                fullWidth
                size="small"
                multiline
                minRows={1}
                maxRows={5}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={loadingEditing}
              />
            )}
          />

          <Stack
            direction="row"
            spacing={1}
            mt={1}
            justifyContent="space-between"
          >
            {/* Toggle SOLO en móvil */}
            {!isDesktop && (
              <Button
                size="small"
                variant="text"
                onClick={() =>
                  setValue("_showAdvanced", !showAdvanced, {
                    shouldDirty: false,
                  })
                }
                startIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
              >
                {showAdvanced ? "Ocultar opciones" : "Más opciones"}
              </Button>
            )}
          </Stack>
        </Box>

        {/* Panel avanzado */}
        <Collapse
          in={showAdvancedResponsive}
          timeout="auto"
          unmountOnExit={!isDesktop}
        >
          <Box sx={{ p: 2, bgcolor: "background.paper" }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 12 }}>
                <Controller
                  name="costo"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Costo"
                      type="number"
                      inputProps={{ step: "0.01", min: 0 }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      disabled={loadingEditing}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12 }}>
                <AutocompleteController
                  name="centrocosto"
                  control={control}
                  label="Centro de costo"
                  options={centroCostosLookup}
                  isLoading={isLoadingCentrosCosto}
                  fetchError={centrosCostoError}
                  disabled={loadingEditing}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12 }}>
                <AutocompleteController
                  name="moneda"
                  control={control}
                  label="Moneda"
                  options={currencyOptions}
                  isLoading={isCurrencyLoading}
                  fetchError={currencyError}
                  disabled={loadingEditing}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12 }}>
                <AutocompleteController
                  name="tipo"
                  control={control}
                  label="Tipo"
                  options={typeOptions}
                  isLoading={isTypeLoading}
                  fetchError={typeError}
                  disabled={loadingEditing}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12 }}>
                <AutocompleteController
                  name="subtipo"
                  control={control}
                  label="Subtipo"
                  options={subTypeOptions}
                  isLoading={isSubTypeLoading}
                  fetchError={subTypeError}
                  disabled={!selectedType || isSubTypeLoading || loadingEditing}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mt: 3, mb: 3 }} />
          </Box>
        </Collapse>

        {/* Footer acciones */}
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          spacing={1}
          sx={{ mx: 2, mb: 2 }}
        >
          {isEditing ? (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={onCancelEdit}
                disabled={isSubmitting || loadingEditing}
              >
                Cancelar
              </Button>
              <Button
                size="small"
                type="submit"
                variant="contained"
                disabled={!canAttemptSend || isSubmitting || loadingEditing}
              >
                Guardar cambios
              </Button>
            </>
          ) : (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={handleClear}
                disabled={isSubmitting}
              >
                Limpiar
              </Button>
              <Button
                size="small"
                type="submit"
                variant="contained"
                disabled={!canAttemptSend || isSubmitting}
              >
                Guardar observación
              </Button>
            </>
          )}
        </Stack>
      </form>
    </FormProvider>
  );
}

export default ObservationForm;
