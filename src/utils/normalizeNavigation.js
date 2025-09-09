import { iconMap } from "@/utils/iconMap";

export const normalizeNavigation = (menus = [], isChild = false) => {
  return (
    menus
      // .filter((item) => item.esta_activo)
      // .sort((a, b) => a.orden_visualizacion - b.orden_visualizacion)
      .map((item) => ({
        name: item.nombre,
        path: item.ruta_url !== "#" ? item.ruta_url : undefined,
        icon: isChild ? undefined : iconMap[item.icono] || undefined,
        children: item.submenus?.length
          ? normalizeNavigation(item.submenus, true)
          : undefined,
      }))
  );
};
