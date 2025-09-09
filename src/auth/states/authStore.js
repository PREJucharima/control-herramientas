import { create } from "zustand";
import { loadAuth, saveAuth, clearAuth } from "../services/storage";

export const useAuthStore = create((set, get) => ({
  user: null,
  access: null,
  refresh: null,
  isAuthenticated: false,

  setAuthData: ({ user, access, refresh = null }) => {
    saveAuth({ user, access, refresh });
    set({ user, access, refresh, isAuthenticated: true });
  },

  logout: () => {
    clearAuth();
    set({ user: null, access: null, refresh: null, isAuthenticated: false });
  },

  restoreSession: () => {
    const saved = loadAuth();
    if (!saved?.access || !saved?.user) return;
    set({ ...saved, isAuthenticated: true });
  },

  getAuthHeader: () => {
    const access = get().access;
    return access ? { Authorization: `Bearer ${access}` } : {};
  },

  setNewAccessToken: (newAccessToken) => {
    const currentState = get();

    saveAuth({ ...currentState, access: newAccessToken });
    set({ access: newAccessToken });
  },
}));
