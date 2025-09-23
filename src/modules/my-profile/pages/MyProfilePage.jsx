import { Fragment, useCallback, useState } from "react";

import {
  Box,
  Card,
  Drawer,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";

import TabComponent from "@/modules/my-profile";
import Apps from "@/icons/Apps";
import Icons from "@/icons/account";
import { FlexBox } from "@/components/flexbox";
import { StyledButton } from "../styles";

const MyProfilePage = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [active, setActive] = useState("Información Básica");
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
          startIcon={Icon ? <Icon /> : null}
          active={active === name}
          onClick={handleListItemBtn(name)}
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
                  Más
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

        <Grid size={{ xs: 12, md: 9 }} sx={{ minWidth: 300, mt: 1 }}>
          {active === tabList[0].name && <TabComponent.BasicInformation />}
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
  },
];

export default MyProfilePage;
