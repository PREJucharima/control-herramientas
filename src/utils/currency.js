const normalize = (s = "") =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .toUpperCase()
    .trim();

export function currencyFromDescripcion(desc = "") {
  const s = normalize(desc);

  // Orden importa: detecta primero los canadienses para no caer en "DÓLAR" genérico
  if (/\b(CAD|CANADIEN(SE|SES)?)\b/.test(s)) return { code: "CAD" }; // DÓLAR(ES) CANADIENSE(S), CAD
  if (/\b(USD|AMERICAN(O|A|OS|AS))\b/.test(s) || /\bDOLARES?\b/.test(s))
    return { code: "USD" };
  if (/\b(EUR|EURO(S)?)\b/.test(s)) return { code: "EUR" };
  if (/\b(PEN|SOL(ES)?|SOLES|NUEVO ?SOL(ES)?)\b/.test(s))
    return { code: "PEN" };

  return { code: "PEN" }; // fallback seguro
}

export function formatMoney(value, code = "PEN", locale = "es-PE") {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    currencyDisplay: "narrowSymbol", // US$, CA$, S/, €
    maximumFractionDigits: 2,
  }).format(n);
}
