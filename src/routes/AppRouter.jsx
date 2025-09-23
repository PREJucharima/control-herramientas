import { useEffect } from "react";

import { Navigate, Route, Routes } from "react-router";
import { CircularProgress } from "@mui/material";

import { AuthRoutes } from "@/auth/routes/AuthRoutes";
import { useAuthStore } from "@/auth/states/authStore";
import { protectedRoutes, RootLayout } from "./routes";

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
            {protectedRoutes.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={Component ? <Component /> : null}
              />
            ))}
          </Route>

          {/* Si entra a /auth, redirige a inicio */}
          <Route index element={<Navigate to="/inicio" />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      )}

      {status === "authenticated" && (
        <Route path="/auth/*" element={<Navigate to="/inicio" />} />
      )}
    </Routes>
  );
};
