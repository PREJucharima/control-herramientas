import { Navigate, Route, Routes } from "react-router";
import { AuthRoutes } from "../modules/auth/routes/AuthRoutes";

export const AppRouter = () => {
  return (
    <Routes>
      <>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/*" element={<Navigate to="/auth/login" />} />
      </>

      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
