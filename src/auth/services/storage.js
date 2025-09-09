const KEY = "auth";

export function loadAuth() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAuth({ user, access, refresh = null }) {
  localStorage.setItem(KEY, JSON.stringify({ user, access, refresh }));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export async function fetchWithAuth(url, options = {}) {
  const auth = loadAuth();
  const headers = {
    ...(options.headers || {}),
    ...(auth?.access ? { Authorization: `Bearer ${auth.access}` } : {}),
  };
  return fetch(url, { ...options, headers });
}
