import { create } from "zustand";

export const useMaestrosStore = create((set) => ({
  maestros: [],
  maestrosLookup: [],
  maestroBySlug: null,

  setMaestros: (m) => set({ maestros: Array.isArray(m) ? m : [] }),
  addMaestro: (m) => set((state) => ({ maestros: [m, ...state.maestros] })),
  updateMaestro: (slug, patch) =>
    set((state) => {
      const maestros = Array.isArray(state.maestros) ? state.maestros : [];
      const updatedList = maestros.map((m) =>
        m?.codigo_unico === slug ? { ...m, ...patch } : m
      );

      const updatedDetail =
        state.maestroBySlug?.codigo_unico === slug
          ? { ...state.maestroBySlug, ...patch }
          : state.maestroBySlug;

      return { maestros: updatedList, maestroBySlug: updatedDetail };
    }),
  removeMaestro: (codigo) =>
    set((state) => ({
      maestros: state.maestros.filter((m) => m.codigo_unico !== codigo),
    })),

  setMaestrosLookup: (m) => set({ maestrosLookup: Array.isArray(m) ? m : [] }),
  setMaestroBySlug: (maestro) => set({ maestroBySlug: maestro }),
}));
