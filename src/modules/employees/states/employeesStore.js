import { create } from "zustand";

export const useEmployeesStore = create((set) => ({
  employees: [],
  employeeById: null,

  setEmployees: (employees) =>
    set({ employees: Array.isArray(employees) ? employees : [] }),
  addEmployee: (e) => set((state) => ({ employees: [e, ...state.employees] })),

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

  setEmployeeBySlug: (employee) => set({ employeeBySlug: employee }),
}));
