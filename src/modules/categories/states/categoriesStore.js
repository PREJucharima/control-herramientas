import { create } from "zustand";

export const useCategoriesStore = create((set) => ({
  categories: [],
  setCategories: (newCategories) =>
    set({ categories: Array.isArray(newCategories) ? newCategories : [] }),
}));
