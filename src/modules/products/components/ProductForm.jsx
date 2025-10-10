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

import { useFetchItemsByMaestro } from "../../items/hooks/useFetchItemsByMaestro";
import { useCatalogChildren } from "../hooks/useCatalogChildren";
import { useBranches } from "../../branch/hooks/useBranches";

const MAESTROS = {
  PRODUCT_STATUS: 9,
  PRODUCT_TYPE: 10,
  TYPE: 5,
  BRAND: 2,
};

const accessories = [
  { title: "Mouse", year: 1994 },
  { title: "Keyboard", year: 1995 },
  { title: "Monitor", year: 2000 },
  { title: "Printer", year: 2005 },
  { title: "Webcam", year: 2010 },
  { title: "Microphone", year: 2015 },
  { title: "Headphones", year: 2020 },
];

const ProductForm = ({
  initialProduct,
  companies = [],
  defaultCompany,
  isLoadingCompanies,
  errorCompanies,
  categories,
  isLoadingCategories,
  errorCategories,
  onSubmit,
  onCancel,
}) => {
  // ---------- Valores iniciales ----------
  const initialValues = {
    empresa: initialProduct?.empresa ?? null,
    sucursal: initialProduct?.sucursal ?? null,
    categoria: initialProduct?.categoria ?? null,
    estado_producto: initialProduct?.estado_producto ?? null,
    tipo_producto: initialProduct?.tipo_producto ?? null,
    nro_serie: initialProduct?.nro_serie ?? "",
    descripcion: initialProduct?.descripcion ?? "",
    tipo: initialProduct?.tipo ?? null,
    subtipo: initialProduct?.subtipo ?? null,
    marca: initialProduct?.marca ?? null,
    modelo: initialProduct?.modelo ?? null,
    es_accesorio: initialProduct?.es_accesorio ?? true,
    es_nuevo: initialProduct?.es_nuevo ?? true,
    esta_activo: initialProduct?.esta_activo ?? true,
  };

  // ---------- Validación ----------
  const validationSchema = Yup.object({
    empresa: Yup.object({ id: Yup.number().required() })
      .nullable()
      .required("La empresa es requerida"),

    sucursal: Yup.object({ id: Yup.number().required() })
      .nullable()
      .required("La sucursal es requerida"),

    categoria: Yup.object({ id: Yup.number().required() })
      .nullable()
      .required("La categoría es requerida"),

    estado_producto: Yup.object({ id: Yup.number().required() })
      .nullable()
      .required("El estado es requerido"),

    tipo_producto: Yup.object({ id: Yup.number().required() })
      .nullable()
      .required("El tipo de producto es requerido"),

    nro_serie: Yup.string().trim().required("El número de serie es requerido"),
    descripcion: Yup.string().trim().required("La descripción es requerida"),

    tipo: Yup.object({ id: Yup.number().required() })
      .nullable()
      .required("El tipo es requerido"),
    subtipo: Yup.object({ id: Yup.number().required() })
      .nullable()
      .required("El subtipo es requerido"),

    marca: Yup.object({ id: Yup.number().required() })
      .nullable()
      .required("La marca es requerida"),
    modelo: Yup.object({ id: Yup.number().required() })
      .nullable()
      .required("El modelo es requerido"),
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

  // Lookups dependientes
  const selectedCompany = useWatch({ control, name: "empresa" });
  const prevCompanyId = useRef();
  const {
    branchesLookup,
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

  console.log("render", { productType });
  console.log({ productTypeWithSerie });

  const onSubmitInternal = handleSubmit(async (values) => {
    const payload = {
      empresa: values.empresa ? values.empresa.id : null,
      sucursal: values.sucursal ? values.sucursal.id : null,
      categoria: values.categoria ? values.categoria.id : null,
      estado_producto: values.estado_producto
        ? values.estado_producto.id
        : null,
      tipo_producto: values.tipo_producto ? values.tipo_producto.id : null,
      nro_serie: values.nro_serie.trim(),
      descripcion: values.descripcion.trim(),
      tipo: values.tipo ? values.tipo.id : null,
      subtipo: values.subtipo ? values.subtipo.id : null,
      marca: values.marca ? values.marca.id : null,
      modelo: values.modelo ? values.modelo.id : null,

      es_accesorio: !!values.es_accesorio,
      es_nuevo: !!values.es_nuevo,
      ...(initialProduct && { esta_activo: !!values.esta_activo }),
    };

    console.log("payload", payload);
    await onSubmit?.(payload);
  });

  const title = initialProduct ? "Editar producto" : "Nuevo producto";
  const subheader = initialProduct
    ? "Modifica los datos del producto seleccionado."
    : "Completa los campos requeridos para crear un nuevo producto.";

  const renderAC = (name, label, options, isLoading, fetchError, disabled) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Autocomplete
          disablePortal
          options={options ?? []}
          value={field.value}
          onChange={(_, val) => field.onChange(val)}
          onBlur={field.onBlur}
          disabled={!!disabled}
          loading={!!isLoading}
          loadingText="Cargando opciones…"
          noOptionsText={
            fetchError ? "Error al cargar opciones" : "Sin opciones"
          }
          isOptionEqualToValue={(o, v) => String(o?.id) === String(v?.id)}
          getOptionLabel={(o) =>
            o?.descripcion ? o.descripcion : o?.nombre ?? ""
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              required
              inputRef={field.ref}
              error={!!fieldState.error || !!fetchError}
              helperText={
                fieldState.error?.message ??
                (fetchError ? "No se pudieron cargar los datos." : undefined)
              }
              fullWidth
              autoComplete="new-password"
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

      <Divider sx={{ mt: 0, mb: 2 }} />

      <FormProvider {...methods}>
        <form onSubmit={onSubmitInternal} noValidate>
          <CardContent>
            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "empresa",
                  "Empresa",
                  companies,
                  isLoadingCompanies,
                  errorCompanies
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "sucursal",
                  "Sucursal",
                  branchesLookup,
                  isLoadingBranches,
                  errorBranches
                )}
              </Grid>
            </Grid>

            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "categoria",
                  "Categoría",
                  categories,
                  isLoadingCategories,
                  errorCategories
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "estado_producto",
                  "Estado del producto ",
                  productStatusOptions,
                  isProductStatusLoading,
                  productStatusError
                )}
              </Grid>
            </Grid>

            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "tipo_producto",
                  "Tipo de producto",
                  productTypeOptions,
                  isProductTypeLoading,
                  productTypeError
                )}
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
                  name="nro_serie"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Nro de Serie *"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      disabled={!productTypeWithSerie}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "tipo",
                  "Tipo",
                  typeOptions,
                  isTypeLoading,
                  typeError
                )}
              </Grid>
            </Grid>

            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "subtipo",
                  "Sub Tipo",
                  subTypeOptions,
                  isSubTypeLoading,
                  subTypeError,
                  !selectedType || isSubTypeLoading
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "marca",
                  "Marca",
                  brandOptions,
                  isBrandLoading,
                  brandError
                )}
              </Grid>
            </Grid>

            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                {renderAC(
                  "modelo",
                  "Modelo",
                  modelOptions,
                  isModelLoading,
                  modelError,
                  !selectedBrand || isModelLoading
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="es_accesorio"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Stack>
                      <FormControlLabel
                        sx={{ ml: 0.5 }}
                        control={
                          <Switch
                            checked={!!field.value}
                            onChange={(_, v) => field.onChange(v)}
                          />
                        }
                        label="Accesorio"
                      />
                      <FormHelperText
                        sx={{ ml: 1.5, mt: 0 }}
                        error={!!fieldState.error}
                      >
                        {fieldState.error?.message ??
                          "Actívalo si este producto es un accesorio (ej. mouse, cargador)."}
                      </FormHelperText>
                    </Stack>
                  )}
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
                    options={accessories}
                    getOptionLabel={(option) => option?.title}
                    // defaultValue={[accessories[1]]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Accesorios"
                        placeholder="accesorios"
                      />
                    )}
                    // sx={{ width: "500px" }}
                  />
                </Grid>
              </Grid>
            )}

            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="es_nuevo"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Stack>
                      <FormControlLabel
                        sx={{ ml: 0.5 }}
                        control={
                          <Switch
                            checked={!!field.value}
                            onChange={(_, v) => field.onChange(v)}
                          />
                        }
                        label="Nuevo"
                      />
                      <FormHelperText
                        sx={{ ml: 1.5, mt: 0 }}
                        error={!!fieldState.error}
                      >
                        {fieldState.error?.message ??
                          "Actívalo si el producto no ha sido usado."}
                      </FormHelperText>
                    </Stack>
                  )}
                />
              </Grid>
              {initialProduct && (
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
              {initialProduct ? "Guardar cambios" : "Crear producto"}
            </Button>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default ProductForm;
