import { memo, useMemo } from "react";
import { Stack, Tooltip } from "@mui/material";
import ChileFlagIcon from "../icons/ChileFlag";
import PeruFlagIcon from "../icons/PeruFlag";
import BoliviaFlag from "../icons/BoliviaFlag";
import EcuadorFlag from "../icons/EcuadorFlag";

/** Quita acentos, colapsa espacios y pasa a minúsculas */
const normalizeText = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Reglas de mapeo: qué patrones activan qué icono */
const COUNTRY_RULES = [
  {
    pattern: /\b(chile|precision chile)\b/,
    Icon: ChileFlagIcon,
    title: "País: Chile",
  },
  {
    pattern: /\b(peru|perú|precision peru)\b/,
    Icon: PeruFlagIcon,
    title: "País: Perú",
  },
  {
    pattern: /\b(peru|perú|precision bolivia)\b/,
    Icon: BoliviaFlag,
    title: "País: Bolivia",
  },
  {
    pattern: /\b(peru|perú|precision ecuador)\b/,
    Icon: EcuadorFlag,
    title: "País: Ecuador",
  },
];

function FlagByCompany({ companyName, size = 26, sx }) {
  // Normaliza el nombre recibido
  const normalizedCompanyName = useMemo(
    () => normalizeText(companyName),
    [companyName]
  );

  // Busca la primera regla que haga match
  const matchedRule = COUNTRY_RULES.find(({ pattern }) =>
    pattern.test(normalizedCompanyName)
  );
  if (!matchedRule) return null;

  // Renderiza el icono correspondiente
  const { Icon, title } = matchedRule;
  return (
    <Stack direction="row" alignItems="center">
      <Tooltip title={title}>
        <Icon sx={{ fontSize: size, mr: 1, ...sx }} aria-label={title} />
      </Tooltip>
    </Stack>
  );
}

export default memo(FlagByCompany);
