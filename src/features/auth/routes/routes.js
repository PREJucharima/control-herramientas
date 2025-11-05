import { lazy } from "react";

const LoginPage = lazy(() => import("../pages/LoginPage"));

export const routes = [
  {
    path: "login",
    Component: LoginPage,
  },
];
