import { create } from "zustand";

export const useItemsStore = create((set) => ({
  items: [],
  itemsByMaestro: [],
  itemBySlug: null,

  // setItems: (items) => set({ items }),
  setItems: (items) => set({ items: Array.isArray(items) ? items : [] }),
  addItem: (i) => set((state) => ({ items: [i, ...state.items] })),
  updateItem: (slug, patch) =>
    set((state) => {
      const items = Array.isArray(state.items) ? state.items : [];
      const updatedList = items.map((i) =>
        i?.codigo === slug ? { ...i, ...patch } : i
      );

      const updatedDetail =
        state.itemBySlug?.codigo === slug
          ? { ...state.itemBySlug, ...patch }
          : state.itemBySlug;

      return { items: updatedList, itemBySlug: updatedDetail };
    }),

  setItemsByMaestro: (itemsByMaestro) => set({ itemsByMaestro }),
  setItemBySlug: (item) => set({ itemBySlug: item }),
  clearItemBySlug: () => set({ itemBySlug: null }),
}));
