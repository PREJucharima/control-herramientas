import { memo, useMemo } from "react";
import { Tooltip } from "@mui/material";
import ChileFlagIcon from "../icons/ChileFlag";
import PeruFlagIcon from "../icons/PeruFlag";

const normalize = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const REG = {
  CHILE: /\b(chile|precision chile)\b/,
  PERU: /\b(peru|perú|precision peru)\b/,
};
const MAP = [
  { test: REG.CHILE, Icon: ChileFlagIcon, title: "País: Chile" },
  { test: REG.PERU, Icon: PeruFlagIcon, title: "País: Perú" },
];

function FlagByCompany({ companyName, size = 24, sx }) {
  const n = useMemo(() => normalize(companyName), [companyName]);
  const m = MAP.find(({ test }) => test.test(n));
  if (!m) return null;

  const { Icon, title } = m;
  return (
    <Tooltip title={title}>
      <span>
        <Icon
          sx={{ fontSize: size, mr: 1, mt: 0.5, ...sx }}
          aria-label={title}
        />
      </span>
    </Tooltip>
  );
}
export default memo(FlagByCompany);
