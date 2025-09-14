import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { FlexBox } from "@/components/flexbox";
import { ContentWrapper } from "../styles";
import { useAuth } from "@/auth/hooks/useAuth";
import { Avatar } from "@mui/material";

export default function UserInfo() {
  const { user } = useAuth();

  return (
    <ContentWrapper>
      <FlexBox justifyContent="center">
        <Avatar
          percentage={60}
          alt="Team Member"
          src={user.picture}
          sx={{
            width: 100,
            height: 100,
          }}
        />
      </FlexBox>

      <Box mt={2}>
        <Typography
          variant="body1"
          fontSize={18}
          fontWeight={600}
          textAlign="center"
        >
          {user.first_name} {user.last_name}
        </Typography>
      </Box>
    </ContentWrapper>
  );
}
