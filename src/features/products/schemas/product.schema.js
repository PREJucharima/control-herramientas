import * as Yup from "yup";

const objIdRequired = Yup.object({ id: Yup.number().required() }).nullable();

const emptyToNull = (v) =>
  typeof v === "string" && v.trim() === "" ? null : v;
const isConSerie = (productType) =>
  (productType?.descripcion ?? "").toUpperCase().trim() === "CON SERIE";

const normalizeDate = (curr, orig) =>
  orig === "" || orig === "null" || orig == null ? null : curr;

export const productSchema = Yup.object({
  empresa: objIdRequired.required("La empresa es requerida"),
  sucursal: objIdRequired.required("La sucursal es requerida"),
  categoria: objIdRequired.required("La categoría es requerida"),
  estado_producto: objIdRequired.required("El estado es requerido"),
  tipo_producto: objIdRequired.required("El tipo de producto es requerido"),
  nro_serie: Yup.string()
    .transform(emptyToNull)
    .nullable()
    .when("tipo_producto", {
      is: (productType) => isConSerie(productType),
      then: (s) => s.required("El Nro de serie es requerido"),
      otherwise: (s) => s.notRequired().nullable(),
    }),
  codigo_sistema: Yup.string().trim().nullable(),
  descripcion: Yup.string().trim().required("La descripción es requerida"),
  tipo: objIdRequired.required("El tipo es requerido"),
  subtipo: objIdRequired.required("El subtipo es requerido"),
  marca: objIdRequired.required("La marca es requerida"),
  modelo: objIdRequired.required("El modelo es requerido"),
  contrato: objIdRequired.nullable(),
  moneda: objIdRequired.nullable(),
  precio: Yup.number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable(),
  orden_compra: Yup.string().nullable(),
  fecha_ingreso: Yup.date()
    .transform(normalizeDate)
    .nullable()
    .typeError("Fecha inválida"),

  es_accesorio: Yup.boolean(),
  es_nuevo: Yup.boolean(),
  esta_activo: Yup.boolean(),
});
