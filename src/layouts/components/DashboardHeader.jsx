import { use } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import Menu from "@/icons/Menu";
import ThemeIcon from "@/icons/ThemeIcon";

import useLayout from "@/layouts/context/useLayout";

import ProfilePopover from "@/layouts/layout-parts/popovers/ProfilePopover";

import { SettingsContext } from "@/contexts/settingsContext";
import { DashboardHeaderRoot, StyledToolBar } from "@/layouts/styles";
import { Breadcrumbs, Typography } from "@mui/material";
import { useAuth } from "@/auth/hooks/useAuth";
import { useCompanyBranchStore } from "@/modules/company-branch/states/companyBranchStore";

export default function DashboardHeader() {
  const { handleOpenMobileSidebar } = useLayout();
  const { settings, saveSettings } = use(SettingsContext);
  const { user } = useAuth();
  const { empresa, sucursal } = useCompanyBranchStore();
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

        <Box flexGrow={1} ml={1} />

        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            variant="body2"
            fontSize={13}
            fontWeight={500}
            color="text.secondary"
          >
            {empresa || user.alcancesAccesibles?.[0]?.empresa_nombre}
          </Typography>
          <Typography
            variant="body2"
            fontSize={13}
            fontWeight={500}
            color="text.secondary"
          >
            {sucursal || user.alcancesAccesibles?.[0]?.sucursal_nombre}
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
