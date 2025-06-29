import { StyledAvatar } from "./styles";

export default function AvatarLoading({
  ref,
  percentage,
  alt = "user",
  borderSize = 1,
  src = "/static/user/user-11.png",
  ...others
}) {
  return (
    <StyledAvatar
      ref={ref}
      alt={alt}
      src={src}
      borderSize={borderSize}
      deg={Math.round((percentage / 100) * 360)}
      {...others}
    />
  );
}
