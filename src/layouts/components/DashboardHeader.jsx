import { use, useState } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import Menu from "@/icons/Menu";
import ThemeIcon from "@/icons/ThemeIcon";
import Search from "@/icons/duotone/Search";

import useLayout from "@/layouts/context/useLayout"; // CUSTOM COMPONENTS

import SearchBar from "@/layouts/layout-parts/SearchBar";
import ProfilePopover from "@/layouts/layout-parts/popovers/ProfilePopover";

import { SettingsContext } from "@/contexts/settingsContext"; // CUSTOM ICON COMPONENTS
import { DashboardHeaderRoot, StyledToolBar } from "@/layouts/styles";
import { Breadcrumbs, Typography } from "@mui/material";
import { useAuth } from "@/auth/hooks/useAuth";

export default function DashboardHeader() {
  const { handleOpenMobileSidebar } = useLayout();
  const [openSearchBar, setSearchBar] = useState(false);
  const { settings, saveSettings } = use(SettingsContext);
  const { user } = useAuth();
  const downMd = useMediaQuery((theme) => theme.breakpoints.down(1200));

  const handleChangeTheme = (value) => {
    saveSettings({ ...settings, theme: value });
  };

  return (
    <DashboardHeaderRoot position="sticky">
      <StyledToolBar>
        {/* SMALL DEVICE SIDE BAR OPEN BUTTON */}
        {downMd && (
          <IconButton onClick={handleOpenMobileSidebar}>
            <Menu />
          </IconButton>
        )}

        {/* SEARCH ICON BUTTON */}
        <ClickAwayListener onClickAway={() => setSearchBar(false)}>
          <div>
            <IconButton onClick={() => setSearchBar(true)}>
              <Search
                sx={{
                  color: "grey.400",
                  fontSize: 18,
                }}
              />
            </IconButton>

            <SearchBar
              open={openSearchBar}
              handleClose={() => setSearchBar(false)}
            />
          </div>
        </ClickAwayListener>

        <Box flexGrow={1} ml={1} />

        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            variant="body2"
            fontSize={13}
            fontWeight={500}
            color="text.secondary"
          >
            {user?.alcancesAccesibles[0]?.empresa_nombre}
          </Typography>
          <Typography
            variant="body2"
            fontSize={13}
            fontWeight={500}
            color="text.secondary"
          >
            {user?.alcancesAccesibles[0]?.sucursal_nombre}
          </Typography>
        </Breadcrumbs>

        {/* THEME SWITCH BUTTON */}
        <IconButton
          onClick={() =>
            handleChangeTheme(settings.theme === "light" ? "dark" : "light")
          }
        >
          <ThemeIcon />
        </IconButton>

        <ProfilePopover />
      </StyledToolBar>
    </DashboardHeaderRoot>
  );
}
