import { create } from "zustand";

export const useCentroCostosStore = create((set) => ({
  centroCostosLookup: [],

  setcentroCostosLookup: (m) =>
    set({ centroCostosLookup: Array.isArray(m) ? m : [] }),
}));
