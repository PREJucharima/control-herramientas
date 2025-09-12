import { useFetchCatalog } from "../hooks/useFetchCatalog";

export const ProductPage = () => {
  const { catalogs, loading, error } = useFetchCatalog();
  

  return (
    <>
      <h1>Catálogos</h1>
      <p>Listado de catálogos</p>
      {loading && <p>Cargando catálogos...</p>}
      {error && <p>Error al cargar catálogos: {error.message}</p>}
      {!loading && !error && (
        <ul>
          {catalogs.map((catalog) => (
            <li key={catalog.id}>{catalog.nombre_catalogo}</li>
          ))}
        </ul>
      )}
    </>
  )
};
