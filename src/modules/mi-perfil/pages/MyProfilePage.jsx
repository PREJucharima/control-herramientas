import React, { Fragment, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import FlexBox from "@/components/flexbox/FlexBox";
import TabComponent from "@/modules/mi-perfil";
import Apps from "@/icons/Apps";
import Icons from "@/icons/account";
import { StyledButton } from "../styles";
import { Grid } from "@mui/material";

const MyProfilePage = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [active, setActive] = useState("Basic Information");
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleListItemBtn = useCallback(
    (name) => () => {
      setActive(name);
      setOpenDrawer(false);
    },
    []
  );

  const TabListContent = (
    <FlexBox flexDirection="column">
      {tabList.map(({ id, name, Icon }) => (
        <StyledButton
          key={id}
          variant="text"
          startIcon={React.createElement(Icon)}
          active={active === name}
          onClick={handleListItemBtn(name)}
        >
          {name}
        </StyledButton>
      ))}
    </FlexBox>
  );

  return (
    <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          {downMd ? (
            <Fragment>
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
                <Apps
                  sx={{
                    color: "text.primary",
                    fontSize: 16,
                  }}
                />
                <Typography variant="body2" fontWeight={500}>
                  More
                </Typography>
              </Box>

              <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                <Box p={1}>{TabListContent}</Box>
              </Drawer>
            </Fragment>
          ) : (
            <Card
              sx={{
                p: "1rem 0",
              }}
            >
              {TabListContent}
            </Card>
          )}
        </Grid>

        <Grid item md={9} xs={12}>
          {active === tabList[0].name && <TabComponent.BasicInformation />}
        </Grid>
      </Grid>
    </div>
  );
};

const tabList = [
  {
    id: 1,
    name: "Basic Information",
    Icon: Icons.UserOutlined,
  },
];

export default MyProfilePage;
