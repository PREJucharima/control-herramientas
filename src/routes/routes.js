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

const ItemsPage = lazy(() => import("@/features/items/pages/ItemsPage"));
const ItemCreatePage = lazy(() =>
  import("@/features/items/pages/ItemCreatePage")
);
const ItemEditPage = lazy(() => import("@/features/items/pages/ItemEditPage"));

const EmployeesPage = lazy(() =>
  import("@/features/employees/pages/EmployeesPage")
);
const EmployeeCreatePage = lazy(() =>
  import("@/features/employees/pages/EmployeeCreatePage")
);
const EmployeeEditPage = lazy(() =>
  import("@/features/employees/pages/EmployeeEditPage")
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
const ContractPage = lazy(() =>
  import("@/features/contract/pages/ContractPage")
);
const ContractCreatePage = lazy(() =>
  import("@/features/contract/pages/ContractCreatePage")
);
const ContractEditPage = lazy(() =>
  import("@/features/contract/pages/ContractEditPage")
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
        element: createElement(ItemsPage),
      },
      {
        path: "/maestros/catalogos/:codigo/nuevo",
        element: createElement(ItemCreatePage),
      },
      {
        path: "/maestros/catalogos/:codigo/:codigo_item/editar",
        element: createElement(ItemEditPage),
      },
      { path: "/maestros/empleados", element: createElement(EmployeesPage) },
      {
        path: "/maestros/empleados/nuevo",
        element: createElement(EmployeeCreatePage),
      },
      {
        path: "/maestros/empleados/:rut/editar",
        element: createElement(EmployeeEditPage),
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
        path: "/maestros/contratos",
        element: createElement(ContractPage),
      },
      {
        path: "/maestros/contratos/nuevo",
        element: createElement(ContractCreatePage),
      },
      {
        path: "/maestros/contratos/:codigo/editar",
        element: createElement(ContractEditPage),
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
