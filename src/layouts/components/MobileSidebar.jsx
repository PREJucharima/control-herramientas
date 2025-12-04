import { Box, styled } from "@mui/material";

import { Scrollbar } from "@/components/ui/scrollbar";
import { LayoutDrawer } from "@/layouts/layout-parts";
import useLayout from "@/layouts/context/useLayout";
import MultiLevelMenu from "./MultiLevelMenu";

const NavWrapper = styled("div")({
  height: "100%",
  paddingLeft: 16,
  paddingRight: 16,
});
const LOGO_PATH = "/static/logo/logo.png";

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
            component="img"
            src={LOGO_PATH}
            alt="logo"
            width={30}
            sx={(theme) => ({
              filter:
                theme.palette.mode === "dark" ? "brightness(0) invert(1)" : "",
              mt: theme.spacing(4),
              ml: theme.spacing(1.5),
            })}
          />

          <MultiLevelMenu sidebarCompact={false} />
        </NavWrapper>
      </Scrollbar>
    </LayoutDrawer>
  );
}
