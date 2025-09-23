import { Box, styled } from "@mui/material";

import { Scrollbar } from "@/components/scrollbar";
import { LayoutDrawer } from "@/layouts/layout-parts";
import useLayout from "@/layouts/context/useLayout";
import MultiLevelMenu from "./MultiLevelMenu";

const NavWrapper = styled("div")({
  height: "100%",
  paddingLeft: 16,
  paddingRight: 16,
});
export default function MobileSidebar() {
  const { showMobileSideBar, handleCloseMobileSidebar } = useLayout();
  return (
    <LayoutDrawer open={showMobileSideBar} onClose={handleCloseMobileSidebar}>
      <Scrollbar
        autoHide
        clickOnTrack={false}
        sx={{
          overflowX: "hidden",
          height: "100%",
        }}
      >
        <NavWrapper>
          <Box
            pl={1}
            pt={3}
            alt="logo"
            maxWidth={45}
            component="img"
            src="/static/logo/logo.png"
          />

          <MultiLevelMenu sidebarCompact={false} />
        </NavWrapper>
      </Scrollbar>
    </LayoutDrawer>
  );
}
