import { StyledBadge } from "./styles";

export default function AvatarBadge({
  children,
  ref,
  width = 25,
  height = 25,
  ...others
}) {
  return (
    <StyledBadge
      ref={ref}
      width={width}
      height={height}
      overlap="circular"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      {...others}
    >
      {children}
    </StyledBadge>
  );
}
