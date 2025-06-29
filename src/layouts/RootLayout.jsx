import { Outlet } from "react-router";

import useMediaQuery from "@mui/material/useMediaQuery";
import MobileSidebar from "./components/MobileSidebar";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";
import LayoutBodyWrapper from "./components/LayoutBodyWrapper";
import { LayoutProvider } from "./context/layoutProvider";

export default function RootLayout() {
  const downLg = useMediaQuery((theme) => theme.breakpoints.down("lg"));
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
