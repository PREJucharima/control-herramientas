import { useEffect, useRef, useState } from "react";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import dayjs from "dayjs";
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
  Autocomplete,
  IconButton,
} from "@mui/material";
import { Clear, InfoOutlined } from "@mui/icons-material";

import {
  DatePicker,
  SwitchController,
  AutocompleteController,
} from "@/components/common/form";
import { useBranches } from "@/features/branches/hooks/useBranches";
import { useFetchItemsByMaestro } from "@/features/items/hooks/useFetchItemsByMaestro";
import { ACCESORIES, MAESTROS } from "../constants/product.constants";
import { useCatalogChildren } from "../hooks/useCatalogChildren";
import { productDefaults } from "../schemas/product.defaults";
import { productSchema } from "../schemas/product.schema";
import { ConfirmationDialog } from "../../../components/ConfirmationDialog";

const ProductForm = ({
  initialProduct,
  companies = [],
  defaultCompany,
  defaultProductStatus,
  isLoadingCompanies,
  errorCompanies,
  categories,
  isLoadingCategories,
  errorCategories,
  onSubmit,
  onCancel,
}) => {
  const toISODate = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const methods = useForm({
    defaultValues: productDefaults(initialProduct),
    resolver: yupResolver(productSchema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  console.log(initialProduct);
  console.log(productDefaults(initialProduct));

  const { control, handleSubmit, setValue, formState, clearErrors } = methods;
  const { isSubmitting, isDirty, isValid } = formState;

  // Lookups dependientes
  const selectedCompany = useWatch({ control, name: "empresa" });
  const prevCompanyId = useRef();
  const {
    branchesLookup: branches,
    isLoading: isLoadingBranches,
    error: errorBranches,
  } = useBranches(selectedCompany?.id);

  useEffect(() => {
    if (!initialProduct && defaultCompany) {
      const companyToSet = companies.find((c) => c.id === defaultCompany.id);
      if (companyToSet) {
        setValue("empresa", companyToSet, { shouldValidate: false });
      }
    }
  }, [initialProduct, defaultCompany, companies, setValue]);

  useEffect(() => {
    if (
      prevCompanyId.current != null &&
      selectedCompany?.id !== prevCompanyId.current
    ) {
      setValue("sucursal", null, { shouldValidate: true, shouldDirty: true });
    }
    prevCompanyId.current = selectedCompany?.id ?? null;
  }, [selectedCompany?.id, setValue]);

  // Obtener los items
  const {
    itemsByMaestro: productStatusOptions,
    isLoading: isProductStatusLoading,
    error: productStatusError,
  } = useFetchItemsByMaestro(MAESTROS.PRODUCT_STATUS);

  const normalize = (s) => (s ?? "").toString().trim().toLowerCase();

  useEffect(() => {
    // solo al crear (no en edición)
    if (initialProduct) return;
    if (!defaultProductStatus) return;
    if (!productStatusOptions || productStatusOptions.length === 0) return;

    const target = normalize(defaultProductStatus);

    // Estrategias de match: id, código, descripción
    const match = productStatusOptions.find(
      (o) => normalize(o.descripcion) === target
    );

    if (match) {
      setValue("estado_producto", match, {
        shouldValidate: true,
        shouldDirty: true, // marca el form como tocado (puedes poner false si no quieres)
      });
    }
  }, [initialProduct, defaultProductStatus, productStatusOptions, setValue]);

  const {
    itemsByMaestro: productTypeOptions,
    isLoading: isProductTypeLoading,
    error: productTypeError,
  } = useFetchItemsByMaestro(MAESTROS.PRODUCT_TYPE);

  const {
    itemsByMaestro: typeOptions,
    isLoading: isTypeLoading,
    error: typeError,
  } = useFetchItemsByMaestro(MAESTROS.TYPE);

  const {
    itemsByMaestro: brandOptions,
    isLoading: isBrandLoading,
    error: brandError,
  } = useFetchItemsByMaestro(MAESTROS.BRAND);

  const {
    itemsByMaestro: contractOptions,
    isLoading: isContractLoading,
    error: contractError,
  } = useFetchItemsByMaestro(MAESTROS.CONTRACT);

  const {
    itemsByMaestro: currencyOptions,
    isLoading: isCurrencyLoading,
    error: currencyError,
  } = useFetchItemsByMaestro(MAESTROS.CURRENCY);

  // Seleccionar tipo y subtipo
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

  // Seleccionar marca y modelo
  const selectedBrand = useWatch({ control, name: "marca" });
  const prevBrandId = useRef();
  const {
    childItems: modelOptions,
    isLoading: isModelLoading,
    error: modelError,
  } = useCatalogChildren(selectedBrand?.id ?? null);

  useEffect(() => {
    if (
      prevBrandId.current != null &&
      selectedBrand?.id !== prevBrandId.current
    ) {
      setValue("modelo", null, { shouldValidate: true, shouldDirty: false });
    }
    prevBrandId.current = selectedBrand?.id ?? null;
  }, [selectedBrand?.id, setValue]);

  // Es accesorio
  const isAccessory = useWatch({ control, name: "es_accesorio" });

  // Tipo de producto
  const productType = useWatch({ control, name: "tipo_producto" });
  const productTypeWithSerie =
    (productType?.descripcion || "").toUpperCase().trim() === "CON SERIE";

  useEffect(() => {
    if (!productTypeWithSerie) {
      // resetField("nro_serie", { defaultValue: "", keepDirty: false });
      setValue("nro_serie", null, { shouldValidate: false, shouldDirty: true });
      clearErrors("nro_serie");
    }
  }, [productTypeWithSerie, setValue, clearErrors]);

  const onSubmitInternal = handleSubmit(async (values) => {
    const payload = {
      empresa: values.empresa ? values.empresa.id : null,
      sucursal: values.sucursal ? values.sucursal.id : null,
      categoria: values.categoria ? values.categoria.id : null,
      estado_producto: values.estado_producto
        ? values.estado_producto.id
        : null,
      tipo_producto: values.tipo_producto ? values.tipo_producto.id : null,
      nro_serie: values.nro_serie ? values.nro_serie : null,
      descripcion: values.descripcion ? values.descripcion : null,
      codigo_sistema: values.codigo_sistema ? values.codigo_sistema : null,
      tipo: values.tipo ? values.tipo.id : null,
      subtipo: values.subtipo ? values.subtipo.id : null,
      marca: values.marca ? values.marca.id : null,
      modelo: values.modelo ? values.modelo.id : null,
      contrato: values.contrato ? values.contrato.id : null,
      moneda: values.moneda ? values.moneda.id : null,
      precio: values.precio ? values.precio : null,
      orden_compra: values.orden_compra ? values.orden_compra : null,
      fecha_ingreso: toISODate(values.fecha_ingreso),

      es_accesorio: !!values.es_accesorio,
      es_nuevo: !!values.es_nuevo,
      ...(initialProduct && { esta_activo: !!values.esta_activo }),
    };

    // console.log("payload", payload);
    // await onSubmit?.(payload);

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

  const title = initialProduct ? "Editar producto" : "Nuevo producto";
  const subheader = initialProduct
    ? "Modifica los datos del producto seleccionado."
    : "Completa los campos requeridos para crear un nuevo producto.";

  return (
    <>
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

        <Divider sx={{ mt: 0, mb: 2 }} />

        <FormProvider {...methods}>
          <form onSubmit={onSubmitInternal} noValidate>
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutocompleteController
                    name="estado_producto"
                    control={control}
                    label="Estado del producto"
                    options={productStatusOptions}
                    isLoading={isProductStatusLoading}
                    fetchError={productStatusError}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4} mb={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutocompleteController
                    name="tipo_producto"
                    control={control}
                    label="Tipo de producto"
                    options={productTypeOptions}
                    isLoading={isProductTypeLoading}
                    fetchError={productTypeError}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="descripcion"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Descripción *"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4} mb={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="codigo_sistema"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Código del sistema"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="nro_serie"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label={`Nro de Serie ${
                          productTypeWithSerie ? "*" : ""
                        }`}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                        disabled={!productTypeWithSerie}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4} mb={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutocompleteController
                    name="tipo"
                    control={control}
                    label="Tipo"
                    options={typeOptions}
                    isLoading={isTypeLoading}
                    fetchError={typeError}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutocompleteController
                    name="subtipo"
                    control={control}
                    label="Sub Tipo"
                    options={subTypeOptions}
                    isLoading={isSubTypeLoading}
                    fetchError={subTypeError}
                    disabled={!selectedType || isSubTypeLoading}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4} mb={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutocompleteController
                    name="marca"
                    control={control}
                    label="Marca"
                    options={brandOptions}
                    isLoading={isBrandLoading}
                    fetchError={brandError}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutocompleteController
                    name="modelo"
                    control={control}
                    label="Modelo"
                    options={modelOptions}
                    isLoading={isModelLoading}
                    fetchError={modelError}
                    disabled={!selectedBrand || isModelLoading}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4} mb={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutocompleteController
                    name="contrato"
                    control={control}
                    label="Contrato"
                    options={contractOptions}
                    isLoading={isContractLoading}
                    fetchError={contractError}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <AutocompleteController
                    name="moneda"
                    control={control}
                    label="Moneda"
                    options={currencyOptions}
                    isLoading={isCurrencyLoading}
                    fetchError={currencyError}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4} mb={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="precio"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label={`Precio`}
                        type="number"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <DatePicker name="fecha_ingreso" label="Fecha de ingreso" />
                    <Tooltip title="Quitar fecha de ingreso">
                      <span>
                        <IconButton
                          aria-label="Quitar fecha de ingreso"
                          onClick={() =>
                            setValue("fecha_ingreso", null, {
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

              <Grid container spacing={4} mb={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="orden_compra"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label={`Orden de compra`}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4} mb={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SwitchController
                    name="es_accesorio"
                    control={control}
                    label="Accesorio"
                    helperText="Actívalo si este producto es un accesorio (ej. mouse, cargador)."
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SwitchController
                    name="es_nuevo"
                    control={control}
                    label="Nuevo"
                    helperText="Actívalo si el producto no ha sido usado."
                  />
                </Grid>
              </Grid>

              {!isAccessory && (
                <Grid container spacing={4} mb={4}>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Autocomplete
                      multiple
                      limitTags={2}
                      fullWidth
                      id="multiple-limit-tags"
                      options={ACCESORIES}
                      getOptionLabel={(option) => option?.title}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Accesorios"
                          placeholder="accesorios"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={4} mb={4}>
                {initialProduct && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <SwitchController
                      name="esta_activo"
                      control={control}
                      label="Activo"
                      helperText="Si está desactivado, el producto no aparecerá en flujos de selección."
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
                {initialProduct ? "Guardar cambios" : "Crear producto"}
              </Button>
            </CardActions>
          </form>
        </FormProvider>
      </Card>

      <ConfirmationDialog
        open={confirmOpen}
        title={`${
          initialProduct ? "Confirmar Cambios" : "Crear nuevo producto"
        } `}
        content={`${
          initialProduct
            ? "¿Estás seguro de que deseas guardar los cambios en este producto?"
            : "¿Estás seguro de que deseas crear este nuevo producto?"
        }`}
        onClose={handleCancelSubmit}
        onConfirm={handleConfirmSubmit}
        isLoading={isSubmitting}
        confirmText="Confirmar"
      />
    </>
  );
};

export default ProductForm;
