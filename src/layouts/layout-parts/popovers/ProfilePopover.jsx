import { memo, useCallback } from "react";
import { useNavigate } from "react-router";

import Avatar from "@mui/material/Avatar";
import AvatarLoading from "@/components/avatar-loading";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FlexBox from "@/components/flexbox/FlexBox";
import PopoverLayout from "./_PopoverLayout";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/material/styles";
import { useAuth } from "@/auth/hooks/useAuth";
import { transformCapitalize } from "@/utils";

const Text = styled("p")(({ theme }) => ({
  fontSize: 13,
  display: "block",
  cursor: "pointer",
  padding: "5px 1rem",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AVATAR_STYLES = {
  width: 35,
  height: 35,
};

export default memo(function ProfilePopover() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const SELECT_BUTTON = (
    <AvatarLoading
      src={user.picture}
      alt={user.name || "Avatar del usuario"}
      percentage={60}
      sx={AVATAR_STYLES}
    />
  );

  const TITLE = (
    <FlexBox alignItems="center" gap={1} p={2} pt={1}>
      <Avatar
        src={user.picture}
        alt={user.name || "Avatar del usuario"}
        sx={AVATAR_STYLES}
      />

      <div>
        <Typography variant="body2" fontWeight={500}>
          {user
            ? `${transformCapitalize(user.first_name)} ${transformCapitalize(
                user.last_name
              )}`
            : "Usuario"}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textTransform={"lowercase"}
          fontSize={12}
        >
          {user?.email}
        </Typography>
      </div>
    </FlexBox>
  );

  const RENDER_CONTENT = useCallback(
    (onClose) => {
      const handleMenuItem = (path) => () => {
        navigate(path);
        onClose();
      };

      return (
        <Box pt={1}>
          <Text onClick={handleMenuItem("/seguridad/mi-perfil")}>
            Ver mi Perfil
          </Text>
          <Text onClick={handleMenuItem("/seguridad/empresa-y-sucursal")}>
            Empresa y Sucursal
          </Text>
          <Text onClick={handleMenuItem("/inicio")}>Configuración</Text>
          <Divider
            sx={{
              my: 1,
            }}
          />
          <Text onClick={handleLogout}>Cerrar Sesión</Text>
        </Box>
      );
    },
    [navigate, handleLogout]
  );

  return (
    <PopoverLayout
      maxWidth={250}
      minWidth={200}
      showMoreButton={false}
      selectButton={SELECT_BUTTON}
      title={TITLE}
      renderContent={RENDER_CONTENT}
    />
  );
});
