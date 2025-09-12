import { create } from "zustand";


export const useCatalogsStore = create((set) => ({
  catalogs: [],
  setCatalogs: (catalogs) => set({ catalogs }),
}));
