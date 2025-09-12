export function parseDate(dateString) {
  const regex = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2}) [+-]\d{4}$/;
  const match = dateString.match(regex);

  if (!match) throw new Error("Format invalide");

  const [, year, month, day, hour, minute, second] = match;

  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}