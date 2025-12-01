import { memo, useCallback, useMemo, useState } from "react";

import { Box, IconButton, Typography } from "@mui/material";

import { FlexBetween } from "@/components/ui/flexbox";
import { Link } from "@/components/ui/link";
import { Scrollbar } from "@/components/ui/scrollbar";
import ArrowLeftToLine from "@/icons/duotone/ArrowLeftToLine";
import useLayout from "@/layouts/context/useLayout";
import MultiLevelMenu from "./MultiLevelMenu";

import { SidebarWrapper } from "../styles";
const TOP_HEADER_AREA = 70;
const LOGO_PATH = "/static/logo/logo.png";

export default function DashboardSidebar() {
  const { sidebarCompact, handleSidebarCompactToggle } = useLayout();
  const [onHover, setOnHover] = useState(false);

  const isCompact = useMemo(
    () => sidebarCompact && !onHover,
    [sidebarCompact, onHover]
  );
  const handleMouseEnter = useCallback(() => {
    setOnHover(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (sidebarCompact) setOnHover(false);
  }, [sidebarCompact]);
  return (
    <SidebarWrapper
      compact={sidebarCompact}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarHeader
        isCompact={isCompact}
        onToggle={handleSidebarCompactToggle}
      />
      <SidebarContent isCompact={isCompact} />
    </SidebarWrapper>
  );
}

const SidebarContent = memo(({ isCompact }) => (
  <Scrollbar
    autoHide
    clickOnTrack={false}
    sx={{
      overflowX: "hidden",
      maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)`,
    }}
  >
    <Box height="100%" px={2} mb={4}>
      <MultiLevelMenu sidebarCompact={isCompact} />
    </Box>
  </Scrollbar>
));

const SidebarHeader = memo(({ isCompact, onToggle }) => (
  <FlexBetween
    padding="1.5rem 1rem .5rem 1.8rem"
    height={TOP_HEADER_AREA}
    sx={{ marginTop: 0, marginBottom: 2 }}
  >
    <Logo isCompact={isCompact} />
    {!isCompact && <CollapseButton onClick={onToggle} />}
  </FlexBetween>
));

const CollapseButton = memo(({ onClick }) => (
  <IconButton onClick={onClick}>
    <ArrowLeftToLine />
  </IconButton>
));

const Logo = memo(({ isCompact }) => (
  <Link href="/">
    <Box component={"div"} display="flex" alignItems="center">
      <Box
        component="img"
        src={LOGO_PATH}
        alt="logo"
        width={30}
        sx={(theme) => ({
          filter:
            theme.palette.mode === "dark" ? "brightness(0) invert(1)" : "",
        })}
      />

      {!isCompact && (
        <Typography
          variant="h6"
          fontWeight={900}
          ml={1}
          letterSpacing={1}
          sx={(theme) => ({
            color:
              theme.palette.mode === "dark"
                ? theme.palette.tertiary[50]
                : theme.palette.tertiary.main,
          })}
        >
          PRECISION
        </Typography>
      )}
    </Box>
  </Link>
));
