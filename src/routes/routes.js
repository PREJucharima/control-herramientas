import { lazy } from "react";

const RootLayout = lazy(() => import("@/layouts/RootLayout"));
const HomePage = lazy(() => import("@/modules/home/pages/HomePage"));
const MaestrosPage = lazy(() => import("@/modules/maestros/pages/MaestrosPage"));
const AddNewMaestroPage = lazy(() => import("@/modules/maestros/pages/AddNewMaestroPage"));
const EditMaestroPage = lazy(() => import("@/modules/maestros/pages/EditMaestroPage"));
const ItemsPage = lazy(() => import("@/modules/items/pages/ItemsPage"));
const AddNewItemPage = lazy(() => import("@/modules/items/pages/AddNewItemPage"));
const EditItemPage = lazy(() => import("@/modules/items/pages/EditItemPage"));
const EmployeesPage = lazy(() => import("@/modules/employees/pages/EmployeesPage"));
const CompanyBranchPage = lazy(() => import("@/modules/company-branch/pages/CompanyBranchPage"));
const MyProfilePage = lazy(() => import("@/modules/my-profile/pages/MyProfilePage"));

export { RootLayout };

export const protectedRoutes = [
  { path: "inicio", Component: HomePage },
  { path: "catalogos/maestros", Component: MaestrosPage },
  { path: "catalogos/maestros/agregar-maestro", Component: AddNewMaestroPage },
  { path: "/catalogos/maestros/:codigo/editar", Component: EditMaestroPage },
  { path: "/catalogos/maestros/:codigo/items", Component: ItemsPage },
  { path: "/catalogos/maestros/:codigo/agregar", Component: AddNewItemPage },
  {
    path: "/catalogos/maestros/:codigo/:codigo_item/editar",
    Component: EditItemPage,
  },
  { path: "/catalogos/empleados", Component: EmployeesPage },
  { path: "seguridad/empresa-y-sucursal", Component: CompanyBranchPage },
  { path: "seguridad/mi-perfil", Component: MyProfilePage },
];
