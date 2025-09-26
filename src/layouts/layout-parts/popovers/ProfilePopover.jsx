import { memo, useCallback } from "react";

import Business from "@mui/icons-material/Business";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Logout from "@mui/icons-material/Logout";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Settings from "@mui/icons-material/Settings";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router";

import { useAuth } from "@/auth/hooks/useAuth";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import PopoverLayout from "./_PopoverLayout";

const AVATAR_SX = { width: 36, height: 36 };

const Text = styled("p")(() => ({
  fontSize: 13,
  display: "block",
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),
}));

const EmailRow = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.4,
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  padding: theme.spacing(1, 2, 0),
}));

const PrettyItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 10,
  margin: "2px 8px",
  padding: "8px 10px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default memo(function ProfilePopover() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, handleLogout } = useAuth();
  const { isCopied, copy } = useCopyToClipboard();

  const fullName = `${user.first_name} ${user.last_name}`.trim() || "";

  const SELECT_BUTTON = (
    <Avatar
      src={user.picture}
      alt={user.name || "Avatar del usuario"}
      percentage={100}
      sx={AVATAR_SX}
    />
  );

  const TITLE = (
    <HeaderBox>
      <Avatar src={user?.picture} alt={fullName} sx={AVATAR_SX} />
      <Box>
        <Typography variant="body2" fontWeight={600} noWrap>
          {fullName}
        </Typography>

        <EmailRow>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: "lowercase" }}
            noWrap
          >
            {user?.email || "—"}
          </Typography>

          {user?.email && (
            <IconButton
              aria-label="Copiar correo"
              onClick={() => copy(user?.email)}
              size="small"
              edge="end"
              sx={{ ml: 0.5, p: 0.15 }}
            >
              {isCopied ? (
                <CheckCircle fontSize="small" />
              ) : (
                <ContentCopy fontSize="small" />
              )}
            </IconButton>
          )}
        </EmailRow>
      </Box>
    </HeaderBox>
  );

  const go = useCallback(
    (path, onClose) => () => {
      navigate(path);
      onClose();
    },
    [navigate]
  );

  const RENDER_CONTENT = useCallback(
    (onClose) => (
      <Box pt={0.5}>
        <SectionTitle>Mi cuenta</SectionTitle>
        <MenuList autoFocusItem>
          <PrettyItem onClick={go("/configuracion/perfil", onClose)}>
            <PersonOutline sx={{ mr: 1 }} />
            <Text>Ver mi perfil</Text>
          </PrettyItem>
          <PrettyItem onClick={go("/seguridad/empresa-y-sucursal", onClose)}>
            <Business sx={{ mr: 1 }} />
            <Text>Empresa y sucursal</Text>
          </PrettyItem>
          <PrettyItem onClick={go("/configuracion/preferencias", onClose)}>
            <Settings sx={{ mr: 1 }} />
            <Text>Configuración</Text>
          </PrettyItem>
        </MenuList>

        <Divider sx={{ my: 1 }} />

        <SectionTitle>Sesión</SectionTitle>
        <MenuList>
          <PrettyItem
            onClick={() => {
              onClose();
              handleLogout();
            }}
            sx={{
              color: theme.palette.error.main,
              "& svg": { color: theme.palette.error.main },
            }}
          >
            <Logout sx={{ mr: 1 }} />
            <Text fontWeight={600}>Cerrar sesión</Text>
          </PrettyItem>
        </MenuList>
      </Box>
    ),
    [go, handleLogout, theme.palette.error.main]
  );

  return (
    <PopoverLayout
      maxWidth={300}
      minWidth={260}
      showMoreButton={false}
      selectButton={SELECT_BUTTON}
      title={TITLE}
      renderContent={RENDER_CONTENT}
    />
  );
});
