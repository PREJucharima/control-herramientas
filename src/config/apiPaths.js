export const API_PATHS = {
  /**
   * @_section Lookup - Endpoints para obtener listas de selección
   */
  lookup: {
    costCenters: `api/centros-costos/lookup/`,
    companies: `api/empresas/lookup/`,
    masters: `api/maestros/lookup/`,
    itemsByMaster: (masterId) =>
      `/api/maestros/lookup/${encodeURIComponent(masterId)}/elementos/`,
    itemsByParent: (parentItemId) =>
      `/api/maestros/lookup/elementos/padre/${encodeURIComponent(
        parentItemId
      )}/`,
    branches: `api/sucursales/lookup/`,
    categories: `api/categorias/lookup/`,
  },

  /**
   * @_section Empleados - CRUD para la gestión de empleados
   */
  employees: {
    list: `api/empleados/`,
    create: `api/empleados/`,
    detail: (rut) => `/api/empleados/${encodeURIComponent(rut)}/`,
    update: (rut) => `/api/empleados/${encodeURIComponent(rut)}/`,
    partialUpdate: (rut) => `/api/empleados/${encodeURIComponent(rut)}/`,
  },

  /**
   * @_section Integraciones - Endpoints para sincronización de datos
   */
  integrations: {
    syncCostCenters: `api/integraciones/sincronizar/centrodecostos/`,
    syncEmployees: `api/integraciones/sincronizar/empleados/`,
    bulkLoadProducts: `api/integraciones/carga-masiva/productos/`,
  },

  /**
   * @_section Elementos Maestros - CRUD para los elementos de un maestro específico
   */
  masterElements: {
    list: (masterCode) =>
      `api/maestros/${encodeURIComponent(masterCode)}/elementos/`,
    create: (masterCode) =>
      `api/maestros/${encodeURIComponent(masterCode)}/elementos/`,
    detail: (masterCode, elementCode) =>
      `api/maestros/${encodeURIComponent(
        masterCode
      )}/elementos/${encodeURIComponent(elementCode)}/`,
    update: (masterCode, elementCode) =>
      `api/maestros/${encodeURIComponent(
        masterCode
      )}/elementos/${encodeURIComponent(elementCode)}/`,
    partialUpdate: (masterCode, elementCode) =>
      `api/maestros/${encodeURIComponent(
        masterCode
      )}/elementos/${encodeURIComponent(elementCode)}/`,
  },

  /**
   * @_section Maestros - Endpoints para hacer mantenimiento de maestros
   */
  masters: {
    list: "api/maestros/definiciones/",
    create: "api/maestros/definiciones/",
    detail: (uniqueCode) =>
      `api/maestros/definiciones/${encodeURIComponent(uniqueCode)}/`,
    update: (uniqueCode) =>
      `api/maestros/definiciones/${encodeURIComponent(uniqueCode)}/`,
    partialUpdate: (uniqueCode) =>
      `api/maestros/definiciones/${encodeURIComponent(uniqueCode)}/`,
  },

  /**
   * @_section Productos - Endpoints para gestión de productos
   */
  products: {
    list: "api/productos/",
    create: "api/productos/",
    detail: (code) => `api/productos/${encodeURIComponent(code)}/`,
    update: (code) => `api/productos/${encodeURIComponent(code)}/`,
    partialUpdate: (code) => `api/productos/${encodeURIComponent(code)}/`,
  },

  /**
   * @_section Observaciones de Productos - CRUD de observaciones
   */
  productsObservations: {
    list: (productCode) =>
      `api/productos/${encodeURIComponent(productCode)}/observaciones/`,
    create: (productCode) =>
      `api/productos/${encodeURIComponent(productCode)}/observaciones/`,
    detail: (productCode, id) =>
      `api/productos/${encodeURIComponent(
        productCode
      )}/observaciones/${encodeURIComponent(id)}/`,
    update: (productCode, id) =>
      `api/productos/${encodeURIComponent(
        productCode
      )}/observaciones/${encodeURIComponent(id)}/`,
    partialUpdate: (productCode, id) =>
      `api/productos/${encodeURIComponent(
        productCode
      )}/observaciones/${encodeURIComponent(id)}/`,
  },

  /**
   * @_section Historial de estados de Productos
   */
  productsStatusHistory: {
    list: (productCode) =>
      `api/productos/${encodeURIComponent(productCode)}/estados-historial/`,
  },

  /**
   * @_section Seguridad - Endpoints para autenticación
   */
  security: {
    login: `api/seguridad/autenticacion/`,
    navigation: `api/seguridad/navegacion/`,
    refresh: `api/seguridad/token/refresh/`,
  },
};
