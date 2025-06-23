import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  expiresAt: null,
  isAuthenticated: false,

  setUserData: (data) => {
    const { token, expiracionToken, ...user } = data;

    localStorage.setItem('auth', JSON.stringify({
      user,
      token,
      expiresAt: expiracionToken,
    }));

    set({
      user,
      token,
      expiresAt: expiracionToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('auth');
    set({
      user: null,
      token: null,
      expiresAt: null,
      isAuthenticated: false,
    });
  },

  checkTokenExpiration: () => {
    const { expiresAt } = get();
    if (!expiresAt) return;

    const now = new Date();
    const expiry = new Date(expiresAt);
    if (now >= expiry) {
      get().logout();
    }
  },

  restoreSession: () => {
    const saved = localStorage.getItem('auth');
    if (!saved) return;

    const { user, token, expiresAt } = JSON.parse(saved);
    const now = new Date();
    const expiry = new Date(expiresAt);

    if (now < expiry) {
      set({
        user,
        token,
        expiresAt,
        isAuthenticated: true,
      });
    } else {
      localStorage.removeItem('auth');
    }
  }
}));
