import { create } from "zustand";

export const useMaestrosStore = create((set) => ({
  maestros: [],
  maestrosLookup: [],
  maestroBySlug: null,

  setMaestros: (m) => set({ maestros: Array.isArray(m) ? m : [] }),
  addMaestro: (m) => set((state) => ({ maestros: [m, ...state.maestros] })),

  setMaestrosLookup: (m) => set({ maestrosLookup: Array.isArray(m) ? m : [] }),

  setMaestroBySlug: (maestro) => set({ maestroBySlug: maestro }),
}));
