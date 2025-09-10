import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CameraAlt from "@mui/icons-material/CameraAlt";

import AvatarBadge from "@/components/avatar-badge";
import AvatarLoading from "@/components/avatar-loading";
import { FlexBox } from "@/components/flexbox";

import { ContentWrapper } from "../styles";

export default function UserInfo() {
  return (
    <ContentWrapper>
      <FlexBox justifyContent="center">
        <AvatarBadge
          badgeContent={
            <label htmlFor="icon-button-file">
              <input
                type="file"
                accept="image/*"
                id="icon-button-file"
                style={{
                  display: "none",
                }}
              />

              <IconButton aria-label="upload picture" component="span">
                <CameraAlt
                  sx={{
                    fontSize: 16,
                    color: "grey.400",
                  }}
                />
              </IconButton>
            </label>
          }
        >
          <AvatarLoading
            borderSize={2}
            percentage={60}
            alt="Team Member"
            src="/static/user/user-11.png"
            sx={{
              width: 100,
              height: 100,
            }}
          />
        </AvatarBadge>
      </FlexBox>

      <Box mt={2}>
        <Typography
          variant="body1"
          fontSize={18}
          fontWeight={600}
          textAlign="center"
        >
          Pixy Krovasky
        </Typography>
      </Box>
    </ContentWrapper>
  );
}
