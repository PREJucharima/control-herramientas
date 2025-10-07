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
   * @_section Seguridad - Endpoints para autenticación
   */
  security: {
    login: `api/seguridad/autenticacion/`,
    navigation: `api/seguridad/navegacion/`,
    refresh: `api/seguridad/token/refresh/`,
  },
};
