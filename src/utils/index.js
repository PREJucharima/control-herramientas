import { matchPath } from "react-router";

export const transformCapitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const formatArea = (area) => {
  const [head, tail] = area.split(" - ");
  return `${head} - ${tail.toLowerCase()}`;
};

// Devuelve el primer segmento de un path como base de sección
// "/configuracion/preferencias" -> "/configuracion/"
export const sectionOf = (p = "") => {
  const segs = p.split("/").filter(Boolean);
  return segs.length ? `/${segs[0]}/` : "/";
};

// Cálculo de "activo" 100% dinámico.
// - level === 1: permitimos heurística por sección (prefijo)
// - hijos: un padre es activo si algún hijo lo es
export const isItemActive = (item, level, pathname) => {
  if (!item) return false;

  // 1) Si tiene hijos: activo si algún hijo está activo
  if (Array.isArray(item.children) && item.children.length > 0) {
    return item.children.some((child) =>
      isItemActive(child, level + 1, pathname)
    );
  }

  // 2) Sin hijos: necesita path
  if (!item.path) return false;

  // 3) Match exacto o descendiente
  if (
    matchPath({ path: item.path, end: true }, pathname) ||
    matchPath({ path: `${item.path}/*` }, pathname)
  ) {
    return true;
  }

  // 4) Heurística de "sección" SOLO para primer nivel
  //    (evita que todos los hijos de /catalogos/ se marquen a la vez)
  if (level === 1) {
    const base = sectionOf(item.path);
    if (base !== "/" && pathname.startsWith(base)) return true;
  }

  return false;
};
