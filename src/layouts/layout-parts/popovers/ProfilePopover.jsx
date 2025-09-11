import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import { useAuth } from "@/auth/hooks/useAuth";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Business from "@mui/icons-material/Business";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import ContentCopy from "@mui/icons-material/ContentCopy";
import CheckCircle from "@mui/icons-material/CheckCircle";
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
    backgroundColor:
      theme.palette.mode === "light"
        ? alpha(theme.palette.primary.main, 0.06)
        : alpha(theme.palette.primary.main, 0.18),
  },
}));

export default memo(function ProfilePopover() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, handleLogout } = useAuth();
  const [copied, setCopied] = useState(false);

  const fullName = `${user.first_name} ${user.last_name}`.trim() || "";

  const copyEmail = useCallback(async () => {
    if (!user?.email) return;
    try {
      await navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Error copying to clipboard:", e);
    }
  }, [user?.email]);

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
              onClick={copyEmail}
              size="small"
              edge="end"
              sx={{ ml: 0.5, p: 0.15 }}
            >
              {copied ? (
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
          <PrettyItem onClick={go("/seguridad/mi-perfil", onClose)}>
            <PersonOutline sx={{ mr: 1 }} />
            <Text>Ver mi perfil</Text>
          </PrettyItem>
          <PrettyItem onClick={go("/seguridad/empresa-y-sucursal", onClose)}>
            <Business sx={{ mr: 1 }} />
            <Text>Empresa y sucursal</Text>
          </PrettyItem>
          <PrettyItem onClick={go("/inicio", onClose)}>
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
