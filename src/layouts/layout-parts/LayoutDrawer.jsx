import { Drawer, styled } from "@mui/material";

const Wrapper = styled("div")(({ theme }) => ({
  height: "100%",
  width: "inherit",
  position: "fixed",
  overflow: "hidden",
  boxShadow: theme.shadows[1],
  zIndex: theme.zIndex.drawer + 3,
  backgroundColor: theme.palette.background.paper,
}));

export default function LayoutDrawer({
  open,
  children,
  onClose,
  drawerWidth = 280,
}) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: drawerWidth,
          },
        },
      }}
    >
      <Wrapper>{children}</Wrapper>
    </Drawer>
  );
}
