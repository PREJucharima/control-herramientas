import { create } from "zustand";
import { googleLogout } from "@react-oauth/google";

import { loadAuth, saveAuth, clearAuth } from "../services/storage";

export const useAuthStore = create((set, get) => ({
  user: null,
  access: null,
  refresh: null,
  status: "checking", // 3 estados: 'checking', 'not-authenticated', 'authenticated'

  setAuthData: ({ user, access, refresh = null }) => {
    saveAuth({ user, access, refresh });
    set({
      user,
      access,
      refresh,
      status: "authenticated",
    });
  },

  logout: () => {
    clearAuth();
    set({
      user: null,
      access: null,
      refresh: null,
      status: "not-authenticated",
    });
    googleLogout();
  },

  restoreSession: () => {
    const saved = loadAuth();
    if (!saved?.access || !saved?.user)
      return set({ status: "not-authenticated" });
    set({ ...saved, status: "authenticated" });
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
