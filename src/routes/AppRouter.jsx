// 1. React
import { useEffect } from "react";

// 2. Librerías Externas
import { Navigate, Route, Routes } from "react-router";
import { CircularProgress } from "@mui/material";

// 3. Módulos Internos (con alias '@/')
import { AuthRoutes } from "@/auth/routes/AuthRoutes";
import RootLayout from "@/layouts/RootLayout";
import { HomePage } from "@/modules/home/pages/HomePage";
import { MaestrosPage } from "@/modules/maestros/pages/MaestrosPage";
import { AddNewMaestroPage } from "@/modules/maestros/pages/AddNewMaestroPage";
import { EditMaestroPage } from "@/modules/maestros/pages/EditMaestroPage";
import { ItemsPage } from "@/modules/items/pages/ItemsPage";
import { AddNewItemPage } from "@/modules/items/pages/AddNewItemPage";
import { CompanyBranchPage } from "@/modules/company-branch/pages/CompanyBranchPage";
import { MyProfilePage } from "@/modules/my-profile/pages/MyProfilePage";
import { EditItemPage } from "@/modules/items/pages/EditItemPage";
import { EmployeesPage } from "@/modules/employees/pages/EmployeesPage";

// 4. Módulos Internos (relativos '../')
import { useAuthStore } from "../auth/states/authStore";

export const AppRouter = () => {
  const status = useAuthStore((state) => state.status);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  console.log(status);

  if (status === "checking") {
    return <CircularProgress />;
  }

  return (
    <Routes>
      {status === "authenticated" ? (
        <>
          {/* Protegidas dentro del layout */}
          <Route path="/" element={<RootLayout />}>
            <Route path="inicio" element={<HomePage />} />
            <Route path="catalogos/maestros" element={<MaestrosPage />} />
            <Route
              path="catalogos/maestros/agregar-maestro"
              element={<AddNewMaestroPage />}
            />
            <Route
              path="/catalogos/maestros/:codigo/editar"
              element={<EditMaestroPage />}
            />
            <Route
              path="/catalogos/maestros/:codigo/items"
              element={<ItemsPage />}
            />
            <Route
              path="/catalogos/maestros/:codigo/agregar"
              element={<AddNewItemPage />}
            />
            <Route
              path="/catalogos/maestros/:codigo/:codigo_item/editar"
              element={<EditItemPage />}
            />

            <Route path="/catalogos/empleados" element={<EmployeesPage />} />

            <Route
              path="seguridad/empresa-y-sucursal"
              element={<CompanyBranchPage />}
            />
            <Route path="seguridad/mi-perfil" element={<MyProfilePage />} />
          </Route>

          {/* Si entra a /auth, redirige a inicio */}
          <Route path="/auth/*" element={<Navigate to="/inicio" />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      )}
    </Routes>
  );
};
