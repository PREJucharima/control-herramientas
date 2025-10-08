const MOCK = [
  {
    id: 1,
    codigo: "P-0001",
    nro_serie: "SN-ABC-001",
    descripcion: "Laptop Dell XPS 13",
    empresa: { id: 1, nombre: "PRECISION CHILE" },
    sucursal: { id: 10, nombre: "Santiago" },
    categoria: { id: 5, nombre: "Computo" },
    estado_producto: { id: 1, nombre: "Operativo" },
    tipo_producto: { id: 2, nombre: "Devolutivo" },
    tipo: { id: 101, nombre: "Laptop" },
    subtipo: { id: 102, nombre: "Ultrabook" },
    marca: { id: 3, nombre: "Dell" },
    modelo: { id: 4, nombre: "XPS 13" },
    es_accesorio: false,
    es_nuevo: true,
    esta_activo: true,
    usuario_creacion: "admin",
    fecha_creacion: "2025-09-01T10:20:00Z",
    usuario_modificacion: "admin",
    fecha_modificacion: "2025-09-10T09:00:00Z",
  },
  {
    id: 2,
    codigo: "P-0002",
    nro_serie: "SN-XYZ-987",
    descripcion: "Monitor LG 27'' 4K",
    empresa: { id: 2, nombre: "PRECISION PERU" },
    sucursal: { id: 20, nombre: "Lima" },
    categoria: { id: 5, nombre: "Computo" },
    estado_producto: { id: 2, nombre: "En reparación" },
    tipo_producto: { id: 3, nombre: "Consumo" },
    tipo: { id: 201, nombre: "Monitor" },
    subtipo: { id: 202, nombre: "4K" },
    marca: { id: 10, nombre: "LG" },
    modelo: { id: 11, nombre: "27UL550-W" },
    es_accesorio: false,
    es_nuevo: false,
    esta_activo: true,
    usuario_creacion: "sara",
    fecha_creacion: "2025-09-05T15:00:00Z",
    usuario_modificacion: "sara",
    fecha_modificacion: "2025-09-11T18:30:00Z",
  },
];

const getter = (obj, path) =>
  path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

export async function getProductsPaginated({
  page = 1,
  pageSize = 10,
  search = "",
  ordering = "codigo",
  esta_activo = null,
}) {
  let rows = [...MOCK];

  // filtro status
  if (esta_activo === true) rows = rows.filter((r) => !!r.esta_activo);
  else if (esta_activo === false) rows = rows.filter((r) => !r.esta_activo);

  // filtro search simple
  const q = search.trim().toLowerCase();
  if (q) {
    rows = rows.filter((p) =>
      [
        p.codigo,
        p.nro_serie,
        p.descripcion,
        p.marca?.nombre,
        p.modelo?.nombre,
        p.empresa?.nombre,
        p.sucursal?.nombre,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }

  // ordenar ("-campo" para desc)
  const desc = ordering.startsWith("-");
  const key = desc ? ordering.slice(1) : ordering;
  rows.sort((a, b) => {
    const va = getter(a, key);
    const vb = getter(b, key);
    const cmp = String(va ?? "").localeCompare(String(vb ?? ""), undefined, {
      numeric: true,
    });
    return desc ? -cmp : cmp;
  });

  const count = rows.length;
  const start = (page - 1) * pageSize;
  const results = rows.slice(start, start + pageSize);

  // simula latencia
  await new Promise((r) => setTimeout(r, 200));

  return { results, count };
}
