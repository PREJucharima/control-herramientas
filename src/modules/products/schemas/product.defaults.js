import dayjs from "dayjs";

export const productDefaults = (initialProduct) => ({
  empresa: initialProduct?.empresa ?? null,
  sucursal: initialProduct?.sucursal ?? null,
  categoria: initialProduct?.categoria ?? null,
  estado_producto: initialProduct?.estado_producto ?? null,
  tipo_producto: initialProduct?.tipo_producto ?? null,
  nro_serie: initialProduct?.nro_serie ?? null,
  descripcion: initialProduct?.descripcion ?? "",
  codigo_sistema: initialProduct?.codigo_sistema ?? "",
  tipo: initialProduct?.tipo ?? null,
  subtipo: initialProduct?.subtipo ?? null,
  marca: initialProduct?.marca ?? null,
  modelo: initialProduct?.modelo ?? null,
  contrato: initialProduct?.contrato ?? null,
  moneda: initialProduct?.moneda ?? null,
  precio: initialProduct?.precio ?? null,
  orden_compra: initialProduct?.orden_compra ?? "",
  fecha_ingreso: initialProduct?.fecha_ingreso
    ? dayjs(initialProduct.fecha_ingreso).toDate()
    : null,
  es_accesorio: initialProduct?.es_accesorio ?? true,
  es_nuevo: initialProduct?.es_nuevo ?? true,
  esta_activo: initialProduct?.esta_activo ?? true,
});
