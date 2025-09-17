import { create } from "zustand";

export const useItemsStore = create((set) => ({
  items: [],
  setItems: (items) => set({ items }),

  itemsByMaestro: [],
  setItemsByMaestro: (itemsByMaestro) => set({ itemsByMaestro }),
}));
