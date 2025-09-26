import { lazy, createElement } from "react";
import { Navigate } from "react-router";

const RootLayout = lazy(() => import("@/layouts/RootLayout"));

const HomePage = lazy(() => import("@/modules/home/pages/HomePage"));

const MaestrosPage = lazy(() =>
  import("@/modules/maestros/pages/MaestrosPage")
);
const AddNewMaestroPage = lazy(() =>
  import("@/modules/maestros/pages/AddNewMaestroPage")
);
const EditMaestroPage = lazy(() =>
  import("@/modules/maestros/pages/EditMaestroPage")
);

const ItemsPage = lazy(() => import("@/modules/items/pages/ItemsPage"));
const AddNewItemPage = lazy(() =>
  import("@/modules/items/pages/AddNewItemPage")
);
const EditItemPage = lazy(() => import("@/modules/items/pages/EditItemPage"));

const EmployeesPage = lazy(() =>
  import("@/modules/employees/pages/EmployeesPage")
);
const CompanyBranchPage = lazy(() =>
  import("@/modules/company-branch/pages/CompanyBranchPage")
);

const MyProfilePage = lazy(() =>
  import("@/modules/my-profile/pages/MyProfilePage")
);

const SettingsLayout = lazy(() =>
  import("@/modules/settings/layouts/SettingsLayout")
);
const ProfileInfoPage = lazy(() =>
  import("@/modules/settings/pages/profile-info/ProfileInfoPage")
);
const PasswordPage = lazy(() =>
  import("@/modules/settings/pages/password/PasswordPage")
);
const PreferencesPage = lazy(() =>
  import("@/modules/settings/pages/preferences/PreferencesPage")
);
const IntegrationsPage = lazy(() =>
  import("@/modules/settings/pages/integrations/IntegrationsPage")
);

export { RootLayout };

export const protectedRoutes = [
  {
    path: "/",
    element: createElement(Navigate, { to: "/inicio", replace: true }),
  },
  {
    element: createElement(RootLayout),
    children: [
      { path: "/inicio", element: createElement(HomePage) },
      { path: "/catalogos/maestros", element: createElement(MaestrosPage) },
      {
        path: "/catalogos/maestros/agregar",
        element: createElement(AddNewMaestroPage),
      },
      {
        path: "/catalogos/maestros/:codigo/editar",
        element: createElement(EditMaestroPage),
      },
      {
        path: "/catalogos/maestros/:codigo/items",
        element: createElement(ItemsPage),
      },
      {
        path: "/catalogos/maestros/:codigo/agregar",
        element: createElement(AddNewItemPage),
      },
      {
        path: "/catalogos/maestros/:codigo/:codigo_item/editar",
        element: createElement(EditItemPage),
      },
      { path: "/catalogos/empleados", element: createElement(EmployeesPage) },
      {
        path: "/seguridad/empresa-y-sucursal",
        element: createElement(CompanyBranchPage),
      },
      { path: "/seguridad/mi-perfil", element: createElement(MyProfilePage) },
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
