import { create } from "zustand";

export const useEmployeesStore = create((set) => ({
  // --- STATE ---
  employees: [], // Para la lista completa de empleados
  employeeDetail: null, // Para el detalle de un solo empleado

  // --- ACTIONS ---

  /**
   * Reemplaza la lista de empleados con una nueva. Ideal para la carga inicial.
   */
  setEmployees: (newEmployees) =>
    set({ employees: Array.isArray(newEmployees) ? newEmployees : [] }),

  /**
   * Añade un nuevo empleado al inicio de la lista.
   */
  addEmployee: (e) => set((state) => ({ employees: [e, ...state.employees] })),

  /**
   * Actualiza un empleado en la lista y en el detalle (si está cargado).
   * @param {number} id - El ID del empleado a actualizar.
   * @param {object} patch - El objeto con los campos a actualizar.
   */
  updateEmployee: (id, patch) =>
    set((state) => {
      const employees = Array.isArray(state.employees) ? state.employees : [];
      const updatedList = employees.map((e) =>
        e?.id === id ? { ...e, ...patch } : e
      );

      const updatedDetail =
        state.employeeById?.id === id
          ? { ...state.maestroBySlug, ...patch }
          : state.maestroBySlug;

      return { maestros: updatedList, maestroBySlug: updatedDetail };
    }),

  /**
   * Guarda el detalle de un empleado específico.
   */
  setEmployeeDetail: (employee) => set({ employeeDetail: employee }),
}));
