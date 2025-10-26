import { useContext } from "react";

import {
  Box,
  Breadcrumbs,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";

import Menu from "@/icons/Menu";
import SunIcon from "@/icons/SunIcon";
import MoonIcon from "@/icons/MoonIcon";
import useLayout from "@/layouts/context/useLayout";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsContext } from "@/contexts/SettingsContext";
import { ProfilePopover } from "@/layouts/layout-parts";
import { DashboardHeaderRoot, StyledToolBar } from "@/layouts/styles";
import { useCompanyBranchStore } from "@/features/company-branch/states/companyBranchStore";

export default function DashboardHeader() {
  const { handleOpenMobileSidebar } = useLayout();
  const { settings, saveSettings } = useContext(SettingsContext);
  const { user } = useAuth();
  const { empresa, sucursal } = useCompanyBranchStore();
  const downMd = useMediaQuery((theme) => theme.breakpoints.down(1200));

  const handleChangeTheme = (value) => {
    saveSettings({ ...settings, theme: value });
    console.log({ ...settings, theme: value });
  };

  return (
    <DashboardHeaderRoot position="sticky">
      <StyledToolBar>
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

        <IconButton
          sx={{ ml: 1 }}
          onClick={() =>
            handleChangeTheme(settings.theme === "light" ? "dark" : "light")
          }
          color="inherit"
        >
          {settings.theme === "light" ? <SunIcon /> : <MoonIcon />}
        </IconButton>

        <ProfilePopover />
      </StyledToolBar>
    </DashboardHeaderRoot>
  );
}
