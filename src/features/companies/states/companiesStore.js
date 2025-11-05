import { create } from "zustand";

export const useCompaniesStore = create((set) => ({
  companies: [],
  setCompanies: (newCompanies) =>
    set({ companies: Array.isArray(newCompanies) ? newCompanies : [] }),
}));
