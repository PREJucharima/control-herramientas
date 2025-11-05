import duotone from "@/icons/duotone";
import SyncIcon from "@mui/icons-material/Sync";
import HttpsRoundedIcon from "@mui/icons-material/HttpsRounded";

export const iconMap = {
  "bi-speedometer2": duotone.Dashboard,
  "bi-book-half": duotone.DataTable,
  "bi-box-seam": duotone.DataTable,
  "bi-boxes": duotone.PersonChalkboard,
  "bi-arrows-move": duotone.DiagramProject,
  "bi-file-earmark-bar-graph-fill": duotone.RectangleCirclePlus,
  "bi-shield-lock-fill": HttpsRoundedIcon,
  "bi-person-badge-fill": duotone.UserRole,
  "bi-people-fill": duotone.UserList,
  "bi-map": duotone.Map,
  "bi-gear-wide-connected": duotone.Settings,
};

export const normalizeKey = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const iconByNameMap = {
  [normalizeKey("Inicio")]: duotone.Dashboard,
  [normalizeKey("Catálogos")]: duotone.DataTable,
  [normalizeKey("Productos")]: duotone.DataTable,
  [normalizeKey("Maestros")]: duotone.DataTable,
  [normalizeKey("Empleados")]: duotone.UserList,

  [normalizeKey("Inventario")]: duotone.PersonChalkboard,
  [normalizeKey("Transacciones")]: duotone.DiagramProject,
  [normalizeKey("Reportes")]: duotone.RectangleCirclePlus,

  [normalizeKey("Seguridad")]: HttpsRoundedIcon,
  [normalizeKey("Usuarios")]: duotone.UserList,
  [normalizeKey("Roles y Permisos")]: duotone.UserRole,
  [normalizeKey("Empresa y Sucursal")]: duotone.Map,

  [normalizeKey("Configuración")]: duotone.Settings,
  [normalizeKey("Preferencias")]: duotone.Settings,
  [normalizeKey("Integraciones")]: SyncIcon,
};
