import { iconMap, iconByNameMap, normalizeKey } from "@/utils/iconMap";

export const normalizeNavigation = (menus = [], isChild = false, opts = {}) => {
  const { showChildIcons = false } = opts;

  return menus.map((item) => {
    const iconCandidate =
      iconByNameMap[normalizeKey(item.nombre)] ?? iconMap[item.icono];

    return {
      name: item.nombre,
      path: item.ruta_url !== "#" ? item.ruta_url : undefined,
      icon: showChildIcons || !isChild ? iconCandidate : undefined,
      children: item.submenus?.length
        ? normalizeNavigation(item.submenus, true, opts)
        : undefined,
    };
  });
};
