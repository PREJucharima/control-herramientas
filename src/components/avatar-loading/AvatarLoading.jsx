import { StyledAvatar } from "./styles";

export default function AvatarLoading({
  ref,
  percentage,
  alt = "user",
  borderSize = 1,
  ...others
}) {
  return (
    <StyledAvatar
      ref={ref}
      alt={alt}
      borderSize={borderSize}
      deg={Math.round((percentage / 100) * 360)}
      {...others}
    />
  );
}
