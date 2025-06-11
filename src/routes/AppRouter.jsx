import { Navigate, Route, Routes } from "react-router";
import { AuthRoutes } from "../modules/auth/routes/AuthRoutes";
import { useCheckAuth } from "../modules/auth/hooks/useCheckAuth";
import { HomePage } from "../modules/home/pages/HomePage";
import { CircularProgress } from "@mui/material";

export const AppRouter = () => {
  const { status } = useCheckAuth();

  if (status === "checking") {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  return (
    <Routes>
      {status === "authenticated" ? (
        <Route path="/*" element={<HomePage />} />
      ) : (
        <Route path="/auth/*" element={<AuthRoutes />} />
      )}

      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
