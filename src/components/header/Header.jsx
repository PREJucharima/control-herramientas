// src/components/Header.jsx
import { Menu, Notifications } from "@mui/icons-material";
import {
  Grid,
  Avatar,
  Badge,
  Box,
  Container,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useUiStore } from "@/core/states/uiStore";

const user = {
  username: "Renato Valer",
  role: "Admin",
  photoURL: "/assets/user.png",
};

export const Header = ({ drawerWidth = 240 }) => {
  const onOpenDrawer = useUiStore((state) => state.onOpenDrawer);

  return (
    <Box
      position="fixed"
      component="header"
      display="flex"
      alignItems="center"
      sx={{
        height: { sm: "100px" },
        width: {
          xs: "100vw",
          sm: `calc(100% - ${drawerWidth}px)`,
        },
        ml: { sm: `${drawerWidth}px` },
        mt: { xs: "20px" },
        zIndex: 100,
        backgroundColor: "#ffffff",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar>
          <Grid
            container
            display="flex"
            direction="row"
            justifyContent={{ xs: "space-between", sm: "end" }}
            alignItems="center"
          >
            <Grid display={{ xs: "block", sm: "none" }}>
              <IconButton onClick={onOpenDrawer}>
                <Menu />
              </IconButton>
            </Grid>

            <Grid item display="flex" alignItems="center">
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={user.photoURL} />
                </ListItemAvatar>
                <ListItemText
                  sx={{ color: "black" }}
                  primary={user.username}
                  secondary={user.role}
                />
              </ListItem>

              <IconButton>
                <Badge badgeContent={2} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </Box>
  );
};
