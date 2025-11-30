import { useCallback } from "react";
import { useSearchParams } from "react-router";

export const useProductPageParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Función auxiliar para actualizar parámetros sin perder los demás
  const setParam = useCallback(
    (key, value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === null || value === undefined || value === "") {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // --- Lectura de Estado (URL -> Variables) ---

  // Filtros y Paginación
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page"), 10) || 1;
  const pageSize = parseInt(searchParams.get("pageSize"), 10) || 10;
  const order = searchParams.get("order") || "asc";
  const orderBy = searchParams.get("orderBy") || "";

  // Códigos para Modales
  const viewCode = searchParams.get("view");
  const observationCode = searchParams.get("observaciones");
  const historyCode = searchParams.get("historial");
  const statusProductCode = searchParams.get("estadoProducto");

  // --- Acciones (Funciones para la UI) ---

  const openView = (code) => setParam("view", String(code));
  const closeView = () => setParam("view", "");

  const openObservation = (code) => setParam("observaciones", String(code));
  const closeObservation = () => setParam("observaciones", "");

  const openHistory = (code) => setParam("historial", String(code));
  const closeHistory = () => setParam("historial", "");

  const openChangeStatus = (code) => setParam("estadoProducto", String(code));
  const closeChangeStatus = () => setParam("estadoProducto", "");

  return {
    // Estado
    searchParams,
    search,
    status,
    page,
    pageSize,
    order,
    orderBy,
    viewCode,
    observationCode,
    historyCode,
    statusProductCode,

    // Setters
    setSearchParams,

    // Acciones Modales
    openView,
    closeView,
    openObservation,
    closeObservation,
    openHistory,
    closeHistory,
    openChangeStatus,
    closeChangeStatus,
  };
};
