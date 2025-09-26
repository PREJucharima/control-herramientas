import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";

import { Box, CircularProgress } from "@mui/material";

import { AuthRoutes } from "@/auth/routes/AuthRoutes";
import { useAuthStore } from "@/auth/states/authStore";
import { protectedRoutes } from "./routes";

function FullscreenLoader() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function renderRoute(r, idx) {
  if (r.index) {
    return <Route key={`idx-${idx}`} index element={r.element} />;
  }

  if (r.children?.length) {
    return (
      <Route key={r.path ?? `key-${idx}`} path={r.path} element={r.element}>
        {r.children.map((child, cIdx) => renderRoute(child, `${idx}-${cIdx}`))}
      </Route>
    );
  }

  return (
    <Route key={r.path ?? `key-${idx}`} path={r.path} element={r.element} />
  );
}

export const AppRouter = () => {
  const status = useAuthStore((s) => s.status);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (status === "checking") return <FullscreenLoader />;

  return (
    <Routes>
      {status === "authenticated" ? (
        <>
          {protectedRoutes.map((r, idx) => renderRoute(r, idx))}

          <Route path="/auth/*" element={<Navigate to="/inicio" replace />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/*" element={<Navigate to="/auth/login" replace />} />
        </>
      )}
    </Routes>
  );
};
