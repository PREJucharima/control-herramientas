import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import AvatarLoading from "@/components/avatar-loading";
import FlexRowAlign from "@/components/flexbox/FlexRowAlign";
import { useAuth } from "@/auth/hooks/useAuth";

export default function UserAccount() {
  const { user } = useAuth();

  return (
    <FlexRowAlign flexDirection="column" py={5}>
      <AvatarLoading
        alt="user"
        percentage={60}
        src="/static/user/user.png"
        sx={{
          width: 50,
          height: 50,
        }}
      />

      <Box textAlign="center" pt={1.5} pb={3}>
        <Chip
          variant="outlined"
          label={`Rol - ${user?.rol_nombre}`}
          size="small"
          color="customTeal"
        />

        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            mt: 2,
          }}
        >
          {user?.first_name} {user?.last_name}
        </Typography>

        <Typography
          variant="body2"
          fontSize={13}
          textTransform={"lowercase"}
          fontWeight={500}
          color="text.secondary"
        >
          {user?.email}
        </Typography>

        <Typography
          variant="body2"
          fontSize={13}
          fontWeight={500}
          color="text.secondary"
        >
          PRECISION
        </Typography>
      </Box>
    </FlexRowAlign>
  );
}
