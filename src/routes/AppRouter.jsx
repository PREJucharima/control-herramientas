import { Navigate, Route, Routes } from "react-router";
import { CircularProgress } from "@mui/material";
import { AuthRoutes } from "@/auth/routes/AuthRoutes";
import { useCheckAuth } from "@/auth/hooks/useCheckAuth";
import { HomePage } from "@/modules/home/pages/HomePage";
import { ProductPage } from "@/modules/catalogo/pages/ProductPage";
import { EmpresaSucursalPage } from "@/modules/empresa-sucursal/pages/EmpresaSucursalPage";
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
            <Route path="catalogos/productos" element={<ProductPage />} />
            <Route
              path="seguridad/empresa-y-sucursal"
              element={<EmpresaSucursalPage />}
            />
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
