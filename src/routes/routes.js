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

export const protectedRoutes = [
  {
    path: "/",
    element: createElement(Navigate, { to: "/inicio", replace: true }),
  },
  {
    element: createElement(RootLayout),
    children: [
      { path: "/inicio", element: createElement(HomePage) },
      { path: "/catalogos/maestros", element: createElement(MastersListPage) },
      {
        path: "/catalogos/maestros/nuevo",
        element: createElement(AddMasterPage),
      },
      {
        path: "/catalogos/maestros/:codigo/editar",
        element: createElement(EditMasterPage),
      },
      {
        path: "/catalogos/maestros/:codigo/items",
        element: createElement(ItemsListPage),
      },
      {
        path: "/catalogos/maestros/:codigo/nuevo",
        element: createElement(AddItemPage),
      },
      {
        path: "/catalogos/maestros/:codigo/:codigo_item/editar",
        element: createElement(EditItemPage),
      },
      { path: "/catalogos/empleados", element: createElement(EmployeesPage) },
      {
        path: "/catalogos/empleados/nuevo",
        element: createElement(AddNewEmployeePage),
      },
      {
        path: "/catalogos/empleados/:rut/editar",
        element: createElement(EditEmployeePage),
      },
      {
        path: "/catalogos/productos",
        element: createElement(ProductsPage),
      },
      {
        path: "/catalogos/productos/nuevo",
        element: createElement(ProductCreatePage),
      },
      {
        path: "/catalogos/productos/:codigo/editar",
        element: createElement(ProductEditPage),
      },
      {
        path: "/catalogos/productos/:codigo",
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
        path: "*",
        element: createElement(Navigate, { to: "/inicio", replace: true }),
      },
    ],
  },
];
