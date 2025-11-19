import { lazy, createElement } from "react";
import { Navigate } from "react-router";

const RootLayout = lazy(() => import("@/layouts/RootLayout"));

const HomePage = lazy(() => import("@/features/home/pages/HomePage"));

const MastersListPage = lazy(() =>
  import("@/features/masters/pages/MastersListPage")
);
const AddMasterPage = lazy(() =>
  import("@/features/masters/pages/AddMasterPage")
);
const EditMasterPage = lazy(() =>
  import("@/features/masters/pages/EditMasterPage")
);

const ItemsListPage = lazy(() =>
  import("@/features/items/pages/ItemsListPage")
);
const AddItemPage = lazy(() => import("@/features/items/pages/AddItemPage"));
const EditItemPage = lazy(() => import("@/features/items/pages/EditItemPage"));

const EmployeesPage = lazy(() =>
  import("@/features/employees/pages/EmployeesPage")
);
const AddNewEmployeePage = lazy(() =>
  import("@/features/employees/pages/AddNewEmployeePage")
);
const EditEmployeePage = lazy(() =>
  import("@/features/employees/pages/EditEmployeePage")
);
const CompanyBranchPage = lazy(() =>
  import("@/features/company-branch/pages/CompanyBranchPage")
);
const SettingsLayout = lazy(() =>
  import("@/features/settings/layouts/SettingsLayout")
);
const ProfileInfoPage = lazy(() =>
  import("@/features/settings/pages/profile-info/ProfileInfoPage")
);
const PasswordPage = lazy(() =>
  import("@/features/settings/pages/password/PasswordPage")
);
const PreferencesPage = lazy(() =>
  import("@/features/settings/pages/preferences/PreferencesPage")
);
const IntegrationsPage = lazy(() =>
  import("@/features/settings/pages/integrations/IntegrationsPage")
);
const ProductsPage = lazy(() =>
  import("@/features/products/pages/ProductsPage")
);
const ProductCreatePage = lazy(() =>
  import("@/features/products/pages/ProductCreatePage")
);
const ProductEditPage = lazy(() =>
  import("@/features/products/pages/ProductEditPage")
);
const ProductDetailPage = lazy(() =>
  import("@/features/products/pages/ProductDetailPage")
);
const SyncPage = lazy(() => import("@/features/integrations/pages/SyncPage"));
const BulkLoadingPage = lazy(() =>
  import("@/features/integrations/pages/BulkLoadingPage")
);

export const protectedRoutes = [
  {
    path: "/",
    element: createElement(Navigate, { to: "/inicio", replace: true }),
  },
  {
    element: createElement(RootLayout),
    children: [
      { path: "/inicio", element: createElement(HomePage) },
      { path: "/maestros/catalogos", element: createElement(MastersListPage) },
      {
        path: "/maestros/catalogos/nuevo",
        element: createElement(AddMasterPage),
      },
      {
        path: "/maestros/catalogos/:codigo/editar",
        element: createElement(EditMasterPage),
      },
      {
        path: "/maestros/catalogos/:codigo/items",
        element: createElement(ItemsListPage),
      },
      {
        path: "/maestros/catalogos/:codigo/nuevo",
        element: createElement(AddItemPage),
      },
      {
        path: "/maestros/catalogos/:codigo/:codigo_item/editar",
        element: createElement(EditItemPage),
      },
      { path: "/maestros/empleados", element: createElement(EmployeesPage) },
      {
        path: "/maestros/empleados/nuevo",
        element: createElement(AddNewEmployeePage),
      },
      {
        path: "/maestros/empleados/:rut/editar",
        element: createElement(EditEmployeePage),
      },
      {
        path: "/maestros/productos",
        element: createElement(ProductsPage),
      },
      {
        path: "/maestros/productos/nuevo",
        element: createElement(ProductCreatePage),
      },
      {
        path: "/maestros/productos/:codigo/editar",
        element: createElement(ProductEditPage),
      },
      {
        path: "/maestros/productos/:codigo",
        element: createElement(ProductDetailPage),
      },
      {
        path: "/seguridad/empresa-y-sucursal",
        element: createElement(CompanyBranchPage),
      },
      {
        path: "/configuracion",
        element: createElement(SettingsLayout),
        children: [
          {
            index: true,
            element: createElement(Navigate, { to: "perfil", replace: true }),
          },
          { path: "perfil", element: createElement(ProfileInfoPage) },
          { path: "contrasena", element: createElement(PasswordPage) },
          { path: "preferencias", element: createElement(PreferencesPage) },
          { path: "integraciones", element: createElement(IntegrationsPage) },
        ],
      },
      {
        path: "/integraciones/sincronizaciones",
        element: createElement(SyncPage),
      },
      {
        path: "/integraciones/cargas-masivas",
        element: createElement(BulkLoadingPage),
      },
      {
        path: "*",
        element: createElement(Navigate, { to: "/inicio", replace: true }),
      },
    ],
  },
];
