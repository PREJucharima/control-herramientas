import { Fragment } from "react";

import Card from "@mui/material/Card";

import { InfoForm, UserInfo } from "./components";
import { CoverPicWrapper } from "./styles";

const ProfileInfoPage = () => {
  return (
    <Fragment>
      <Card
        sx={{
          padding: 3,
          position: "relative",
        }}
      >
        <CoverPicWrapper>
          <img
            width="100%"
            height="100%"
            alt="Team Member"
            src="/static/cover/cover.png"
          />
        </CoverPicWrapper>

        <UserInfo />
      </Card>

      <InfoForm />
    </Fragment>
  );
};

export default ProfileInfoPage;
