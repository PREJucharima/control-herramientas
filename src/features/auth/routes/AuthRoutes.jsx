import { createElement } from "react";

import { Navigate, Route, Routes } from "react-router";

import { routes } from "./routes";

export const AuthRoutes = () => {
  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path} element={createElement(Component)} />
      ))}

      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
