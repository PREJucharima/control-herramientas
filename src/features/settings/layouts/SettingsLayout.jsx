import { useState } from "react";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router";

import {
  Box,
  Card,
  Drawer,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";

import Apps from "@/icons/Apps";
import Icons from "@/icons/account";
import { FlexBox } from "@/components/ui/flexbox";
import { StyledButton } from "../styles";

const SettingsLayout = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (to) =>
    !!(
      matchPath({ path: to, end: true }, pathname) ||
      matchPath({ path: `${to}/*` }, pathname)
    );

  const TabListContent = (
    <FlexBox flexDirection="column">
      {tabList.map(({ id, name, Icon, to }) => (
        <StyledButton
          key={id}
          variant="text"
          startIcon={Icon ? <Icon /> : null}
          active={isActive(to)}
          onClick={() => {
            if (downMd) setOpenDrawer(false);
            navigate(to);
          }}
          sx={{
            justifyContent: "flex-start",
            ...(isActive(to) && {
              bgcolor: (t) => t.palette.action.selected,
              fontWeight: 600,
            }),
          }}
        >
          {name}
        </StyledButton>
      ))}
    </FlexBox>
  );

  return (
    <div className="pb-4">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }} sx={{ minWidth: 200, mt: 1 }}>
          {downMd ? (
            <>
              <Box
                onClick={() => setOpenDrawer(true)}
                sx={{
                  gap: 0.5,
                  cursor: "pointer",
                  alignItems: "center",
                  display: "inline-flex",
                  color: "text.secondary",
                }}
              >
                <Apps sx={{ color: "text.primary", fontSize: 16 }} />
                <Typography variant="body2" fontWeight={500}>
                  Más
                </Typography>
              </Box>

              <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                <Box p={1}>{TabListContent}</Box>
              </Drawer>
            </>
          ) : (
            <Card sx={{ p: "1rem 0" }}>{TabListContent}</Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 9 }} sx={{ minWidth: 300, mt: 1 }}>
          <Outlet />
        </Grid>
      </Grid>
    </div>
  );
};

const tabList = [
  {
    id: 1,
    name: "Información Básica",
    Icon: Icons.UserOutlined,
    to: "/configuracion/perfil",
  },
  {
    id: 2,
    name: "Contraseña",
    Icon: Icons.LockOutlined,
    to: "/configuracion/contrasena",
  },
  {
    id: 3,
    name: "Preferencias",
    Icon: Icons.SettingsOutlined,
    to: "/configuracion/preferencias",
  },
  {
    id: 4,
    name: "Integraciones",
    Icon: SyncIcon,
    to: "/configuracion/integraciones",
  },
];

export default SettingsLayout;
