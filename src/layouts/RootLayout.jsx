import { Outlet } from "react-router";

import useMediaQuery from "@mui/material/useMediaQuery";
import MobileSidebar from "./components/MobileSidebar";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";
import LayoutBodyWrapper from "./components/LayoutBodyWrapper";
import { LayoutProvider } from "./context/layoutProvider";
import { useAuth } from "@/auth/hooks/useAuth";
import { useEffect } from "react";

export default function RootLayout() {
  const { user, logout } = useAuth();
  const downLg = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  useEffect(() => {
    if (!user) {
      logout();
    }
  }, [user, logout]);

  if (!user) {
    return null;
  }

  return (
    <LayoutProvider>
      {downLg ? <MobileSidebar /> : <DashboardSidebar />}

      <LayoutBodyWrapper>
        <DashboardHeader />

        <Outlet />
      </LayoutBodyWrapper>
    </LayoutProvider>
  );
}
