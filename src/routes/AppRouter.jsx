import { Navigate, Route, Routes } from "react-router";
import { CircularProgress } from "@mui/material";
import { AuthRoutes } from "@/auth/routes/AuthRoutes";
import { useCheckAuth } from "@/auth/hooks/useCheckAuth";
import { HomePage } from "@/modules/home/pages/HomePage";
import { ProductPage } from "@/modules/catalogo/pages/ProductPage";

export const AppRouter = () => {
  const { status } = useCheckAuth();

  if (status === "checking") {
    return <CircularProgress />;
  }

  return (
    <Routes>
      {status === "authenticated" ? (
        <>
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/catalogos/productos" element={<ProductPage />} />
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
