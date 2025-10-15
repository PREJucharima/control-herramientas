import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Stack,
  Tooltip,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  Collapse,
  Grid,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
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
}) {
  const methods = useForm({
    defaultValues: {
      observacion: "",
      costo: null,
      tipo: null,
      subtipo: null,
      moneda: null,
      centrocosto: defaultCostCenter,
      _showAdvanced: false, // toggle UI
    },
    resolver: yupResolver(schema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
    reset,
  } = methods;

  const showAdvanced = useWatch({ control, name: "_showAdvanced" });

  // Cargar opciones para moneda
  const {
    itemsByMaestro: currencyOptions,
    isLoading: isCurrencyLoading,
    error: currencyError,
  } = useFetchItemsByMaestro(MAESTROS.CURRENCY);

  // Cargar opciones para tipo y subtipo
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

  // Cargar opciones para centro de costo
  const {
    centroCostosLookup,
    isLoading: isLoadingCentrosCosto,
    error: centrosCostoError,
  } = useCentroCostos(defaultCompany?.id);

  // Habilitar enviar si hay algo válido
  const observacion = useWatch({ control, name: "observacion" });
  const canSend = useMemo(() => {
    return isValid && (observacion ?? "").trim().length >= 3 && !isSubmitting;
  }, [isValid, observacion, isSubmitting]);

  const buildPayload = useCallback(
    (values) => {
      return {
        producto_codigo: productCode,
        observacion: (values.observacion ?? "").trim(),
        costo: values.costo != null ? String(values.costo) : null,

        tipo: values.tipo?.id ?? 0,
        subtipo: values.subtipo?.id ?? 0,
        moneda: values.moneda?.id ?? 0,
        centrocosto: values.centrocosto?.id ?? 0,
      };
    },
    [productCode]
  );

  const onSubmitInternal = handleSubmit(async (values) => {
    const payload = buildPayload(values);
    console.log("Payload a enviar:", payload);
    await onSubmit?.(payload);
    reset(
      {
        ...values,
        observacion: "",
        costo: null,
        subtipo: null,
      },
      { keepDefaultValues: false }
    );
  });

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSubmitInternal();
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmitInternal} noValidate>
        {/* Barra pegajosa con textarea + enviar */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          <Controller
            name="observacion"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                onKeyDown={onKeyDown}
                placeholder="Escribe una observación..."
                fullWidth
                size="small"
                multiline
                minRows={1}
                maxRows={5}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enviar (Enter)">
                        <span>
                          <IconButton
                            type="submit"
                            disabled={!canSend}
                            edge="end"
                          >
                            <SendIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Stack
            direction="row"
            spacing={1}
            mt={1}
            justifyContent="space-between"
          >
            <Button
              size="small"
              variant="text"
              onClick={() =>
                setValue("_showAdvanced", !showAdvanced, { shouldDirty: false })
              }
              startIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
            >
              {showAdvanced ? "Ocultar opciones" : "Más opciones"}
            </Button>

            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  reset(
                    {
                      observacion: "",
                      costo: null,
                      tipo: null,
                      subtipo: null,
                      moneda: null,
                      centrocosto: defaultCostCenter ?? null,
                      _showAdvanced: showAdvanced,
                    },
                    { keepDefaultValues: false }
                  )
                }
              >
                Limpiar
              </Button>
              {/* <Button
                size="small"
                type="submit"
                variant="contained"
                disabled={!canSend}
              >
                Enviar
              </Button> */}
            </Stack>
          </Stack>
        </Box>

        <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
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
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AutocompleteController
                  name="centrocosto"
                  control={control}
                  label="Centro de costo"
                  options={centroCostosLookup}
                  isLoading={isLoadingCentrosCosto}
                  fetchError={centrosCostoError}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AutocompleteController
                  name="moneda"
                  control={control}
                  label="Moneda"
                  options={currencyOptions}
                  isLoading={isCurrencyLoading}
                  fetchError={currencyError}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AutocompleteController
                  name="tipo"
                  control={control}
                  label="Tipo"
                  options={typeOptions}
                  isLoading={isTypeLoading}
                  fetchError={typeError}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AutocompleteController
                  name="subtipo"
                  control={control}
                  label="Subtipo"
                  options={subTypeOptions}
                  isLoading={isSubTypeLoading}
                  fetchError={subTypeError}
                  disabled={!selectedType || isSubTypeLoading}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mt: 3 }} />
          </Box>
        </Collapse>
      </form>
    </FormProvider>
  );
}

export default ObservationForm;
