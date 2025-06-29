import { create } from "zustand";

export const useUiStore = create((set) => ({
  isDrawerOpen: false,

  onOpenDrawer: () => set({ isDrawerOpen: true }),
  onCloseDrawer: () => set({ isDrawerOpen: false }),
}));
