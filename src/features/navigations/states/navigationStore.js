import { create } from "zustand";

export const useNavigationStore = create((set) => ({
  menus: [],
  setMenus: (menus) => set({ menus }),
}));
