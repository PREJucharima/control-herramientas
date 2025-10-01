import { Container, styled } from "@mui/material";

import useLayout from "@/layouts/context/useLayout";

const RootStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "compact",
})(({ theme, compact }) => ({
  marginLeft: compact ? 86 : 280,
  transition: "margin-left 0.3s ease-in-out",
  [theme.breakpoints.down(1200)]: {
    marginLeft: 0,
  },
}));
export default function LayoutBodyWrapper({ children }) {
  const { sidebarCompact } = useLayout();
  return (
    <RootStyled compact={sidebarCompact}>
      <Container maxWidth="lg">{children}</Container>
    </RootStyled>
  );
}
