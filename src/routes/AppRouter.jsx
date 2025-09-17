import { Navigate, Route, Routes } from "react-router";
import { CircularProgress } from "@mui/material";
import { AuthRoutes } from "@/auth/routes/AuthRoutes";
import { useCheckAuth } from "@/auth/hooks/useCheckAuth";
import { HomePage } from "@/modules/home/pages/HomePage";
import { MaestrosPage } from "@/modules/maestros/pages/MaestrosPage";
import { CompanyBranchPage } from "@/modules/company-branch/pages/CompanyBranchPage";
import { MyProfilePage } from "@/modules/my-profile/pages/MyProfilePage";
import { ItemsPage } from "@/modules/items/pages/ItemsPage";
import { AddNewItemPage } from "@/modules/items/pages/AddNewItemPage";
import { AddNewMaestroPage } from "@/modules/maestros/pages/AddNewMaestroPage";
import { EditMaestroPage } from "@/modules/maestros/pages/EditMaestroPage";

import RootLayout from "@/layouts/RootLayout";

export const AppRouter = () => {
  const { status } = useCheckAuth();

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
              path="catalogos/agregar-maestro"
              element={<AddNewMaestroPage />}
            />
            <Route
              path="/catalogos/:codigo/editar"
              element={<EditMaestroPage />}
            />
            <Route
              path="/catalogos/:codigo/lista-items"
              element={<ItemsPage />}
            />
            <Route
              path="/catalogos/:codigo/agregar-item"
              element={<AddNewItemPage />}
            />

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
