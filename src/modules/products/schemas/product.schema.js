import * as Yup from "yup";

const objIdRequired = Yup.object({ id: Yup.number().required() }).nullable();

const emptyToNull = (v) =>
  typeof v === "string" && v.trim() === "" ? null : v;
const isConSerie = (productType) =>
  (productType?.descripcion ?? "").toUpperCase().trim() === "CON SERIE";

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
  descripcion: Yup.string().trim().required("La descripción es requerida"),
  tipo: objIdRequired.required("El tipo es requerido"),
  subtipo: objIdRequired.required("El subtipo es requerido"),
  marca: objIdRequired.required("La marca es requerida"),
  modelo: objIdRequired.required("El modelo es requerido"),
});
