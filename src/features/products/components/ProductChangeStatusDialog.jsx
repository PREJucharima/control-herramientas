import * as Yup from "yup";
import { useEffect, useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
} from "@mui/material";

import { AutocompleteController } from "@/components/common/form";
import { useFetchProductByCode } from "../hooks/useFetchProductByCode";
import { changeProductStatus } from "../services/partialUpdateProduct";
import { MAESTROS } from "../constants/product.constants";
import { useFetchItemsByMaestro } from "../../items/hooks/useFetchItemsByMaestro";

const partialProductSchema = Yup.object({
  nuevo_estado: Yup.object({ id: Yup.number().required() })
    .nullable()
    .required("El tipo de producto es requerido"),
  motivo_estado_producto: Yup.string().trim().nullable(),
});

export default function ProductChangeStatusDialog({
  open,
  productCode,
  onClose,
  onSuccess,
}) {
  const { productDetail, isLoading, error } =
    useFetchProductByCode(productCode);
  const currentState = productDetail?.estado_producto || null;
  const currentId = currentState?.id;

  const {
    itemsByMaestro: productStatusOptions,
    isLoading: isProductStatusLoading,
    error: productStatusError,
  } = useFetchItemsByMaestro(MAESTROS.PRODUCT_STATUS);

  // Opciones sin estado actual y sin "ASIGNADO"
  const options = useMemo(() => {
    const ban = new Set([String(currentId ?? "")]);
    return (productStatusOptions || [])
      .filter((s) => !ban.has(String(s.id)))
      .filter((s) => (s.descripcion || "").toUpperCase() !== "ASIGNADO");
  }, [productStatusOptions, currentId]);

  const methods = useForm({
    defaultValues: {
      nuevo_estado: null,
      motivo_estado_producto: "",
    },
    resolver: yupResolver(partialProductSchema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty, isValid },
  } = methods;

  // Reset al abrir o cuando cambia el producto
  useEffect(() => {
    if (open) {
      reset(
        { nuevo_estado: null, motivo_estado_producto: "" },
        { keepDefaultValues: false }
      );
    }
  }, [open, productCode, reset]);

  const title = useMemo(
    () =>
      `Cambiar estado ${
        productCode ? `· ${productDetail?.nro_serie || productCode}` : ""
      }`,
    [productCode, productDetail]
  );

  const onSubmit = handleSubmit(async (values) => {
    console.log("Submitting", values);
    try {
      await changeProductStatus(
        productCode,
        values.nuevo_estado.id,
        values.motivo_estado_producto || null
      );
      onSuccess?.();
      onClose?.();
    } catch (e) {
      setError("root", {
        type: "server",
        message: e?.message || "No se pudo guardar. Intenta nuevamente.",
      });
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      {(isSubmitting || isLoading) && <LinearProgress />}

      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error">
            Error al cargar el producto: {error?.message || "Intenta de nuevo."}
          </Alert>
        )}

        {!isLoading && !error && (
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} noValidate>
              <Stack spacing={2}>
                {/* Estado actual */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ color: "text.secondary", minWidth: 110 }}>
                    Estado actual:
                  </Box>
                  <Chip
                    size="small"
                    color="info"
                    variant="outlined"
                    label={currentState?.descripcion || "—"}
                  />
                </Stack>

                {/* Nuevo estado (RHF + Autocomplete) */}
                <AutocompleteController
                  name="nuevo_estado"
                  control={control}
                  label="Nuevo estado del producto"
                  options={options}
                  isLoading={isProductStatusLoading}
                  fetchError={productStatusError}
                />

                {/* motivo_estado_producto (opcional o condicional) */}
                <Controller
                  name="motivo_estado_producto"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Motivo (opcional)"
                      placeholder="Ej.: Cambio de estado"
                      multiline
                      minRows={2}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                {/* Error de API mapeado a root */}
                {methods.formState.errors.root?.message && (
                  <Alert severity="error">
                    {methods.formState.errors.root.message}
                  </Alert>
                )}
              </Stack>

              <DialogActions sx={{ mt: 2 }}>
                <Button
                  onClick={onClose}
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !isDirty || !isValid}
                >
                  Guardar
                </Button>
              </DialogActions>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
