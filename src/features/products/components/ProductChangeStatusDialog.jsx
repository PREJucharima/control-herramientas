// src/modules/products/components/ProductChangeStatusDialog.jsx
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
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
import { useFetchProductByCode } from "../hooks/useFetchProductByCode";
import { changeProductStatus } from "../services/partialUpdateProduct";

/**
 * Si ya tienes un servicio para traer los estados, úsalo.
 * Aquí dejo un prop opcional `statusOptions` para inyectarlos desde arriba.
 * Formato esperado: [{ id, descripcion }]
 */
export default function ProductChangeStatusDialog({
  open,
  productCode,
  statusOptions = [], // pásalo desde arriba si quieres
  onClose,
  onSuccess, // opcional: callback para refrescar la tabla
}) {
  const { productDetail, isLoading, error } =
    useFetchProductByCode(productCode);

  const currentState = productDetail?.estado_producto || null; // { id, descripcion }
  const currentId = currentState?.id;

  // Filtra: sin estado actual ni "ASIGNADO"
  const options = useMemo(() => {
    const ban = new Set([
      String(currentId ?? ""),
      // excluye ASIGNADO por descripción
      // (ajusta la comparación a tu backend si usas un código)
    ]);
    return (statusOptions || [])
      .filter((s) => !ban.has(String(s.id)))
      .filter((s) => (s.descripcion || "").toUpperCase() !== "ASIGNADO");
  }, [statusOptions, currentId]);

  // Estado del formulario
  const [selected, setSelected] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState(null);

  const title = useMemo(
    () =>
      `Cambiar estado ${
        productCode ? `· ${productDetail?.nro_serie || productCode}` : ""
      }`,
    [productCode, productDetail]
  );

  const canSubmit = !!selected?.id && !submitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      setSubmitErr(null);
      await changeProductStatus(productCode, selected.id, motivo);
      onSuccess?.(); // refresca lista si te interesa
      onClose?.(); // cierra el diálogo
    } catch (e) {
      setSubmitErr(e);
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, productCode, selected?.id, motivo, onClose, onSuccess]);

  // Reset cuando se abre/cambia productCode
  const resetForm = useCallback(() => {
    setSelected(null);
    setMotivo("");
    setSubmitErr(null);
    setSubmitting(false);
  }, []);
  // Resetea al abrir/cambiar producto
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => (open ? resetForm() : null), [open, productCode]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      {submitting && <LinearProgress />}

      <DialogContent sx={{ pt: 1 }}>
        {isLoading && (
          <Box sx={{ py: 3 }}>
            <LinearProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error">
            Error al cargar el producto: {error?.message || "Intenta de nuevo."}
          </Alert>
        )}

        {!isLoading && !error && (
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

            {/* Nuevo estado */}
            <Autocomplete
              value={selected}
              onChange={(_e, v) => setSelected(v)}
              options={options}
              getOptionLabel={(o) => o?.descripcion ?? ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nuevo estado"
                  placeholder="Selecciona un estado"
                />
              )}
              disableClearable
            />

            {/* Motivo opcional */}
            <TextField
              label="Motivo (opcional)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej.: Cambio de estado"
              multiline
              minRows={2}
            />

            {submitErr && (
              <Alert severity="error">
                No se pudo guardar:{" "}
                {submitErr?.message || "intenta nuevamente."}
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
