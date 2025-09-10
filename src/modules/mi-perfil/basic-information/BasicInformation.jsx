import { Fragment } from "react";
import Card from "@mui/material/Card";

import InfoForm from "./info-form";
import UserInfo from "./user-info";

import { CoverPicWrapper } from "./styles";
export default function BasicInformation() {
  return (
    <Fragment>
      <Card>
        {/* COVER IMAGE SECTION */}
        <CoverPicWrapper>
          <img
            width="100%"
            height="100%"
            alt="Team Member"
            src="/static/cover/user-cover-pic.png"
          />
        </CoverPicWrapper>

        {/* USER INFO SECTION */}
        <UserInfo />
      </Card>

      {/* BASIC INFORMATION FORM SECTION */}
      <InfoForm />
    </Fragment>
  );
}
