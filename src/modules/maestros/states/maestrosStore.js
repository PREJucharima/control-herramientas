import { create } from "zustand";

export const useMaestrosStore = create((set) => ({
  maestros: [],
  setMaestros: (maestros) => set({ maestros }),
}));
