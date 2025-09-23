import { styled } from "@mui/material/styles";

const lightGradient = `
  radial-gradient(
    circle at 90% 0%,
    rgba(141, 233, 211, 0.4), /* secundario */
    rgba(244, 244, 255, 0) 50% /* terciario */
  ),
  radial-gradient(
    circle at 0% 90%,
    rgba(244, 244, 255, 0.6), /* terciario */
    rgba(244, 244, 255, 0.2) 50%
  )
`;

const darkGradient = `
  radial-gradient(
    circle at 90% 0%,
    rgba(33, 224, 178, 0.15), /* secundario más sutil */
    rgba(10, 26, 40, 0.7) 50% /* primario */
  ),
  radial-gradient(
    circle at 0% 90%,
    rgba(244, 244, 255, 0.1), /* terciario */
    rgba(10, 26, 40, 0.8) 50% /* primario más fuerte */
  )
`;

export const StyledRoot = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  background: lightGradient,
  ...theme.applyStyles("dark", {
    background: darkGradient,
  }),
}));
