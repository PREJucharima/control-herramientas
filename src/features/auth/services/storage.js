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
