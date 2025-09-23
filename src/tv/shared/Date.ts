export function parseDateTime(dateString: string): Date {
  const regex = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2}) [+-]\d{4}$/;
  const match = dateString.match(regex);

  if (!match) throw new Error("Format invalide");

  const [, year, month, day, hour, minute, second] = match;

  const yearInt = parseInt(year, 10);
  const monthInt = parseInt(month, 10);
  const dayInt = parseInt(day, 10);
  const hourInt = parseInt(hour, 10);
  const minuteInt = parseInt(minute, 10);
  const secondInt = parseInt(second, 10);

  return new Date(Date.UTC(yearInt, monthInt - 1, dayInt, hourInt, minuteInt, secondInt));
}

export function parseDate(dateString: string): Date {
  const regex = /^(\d{4})(\d{2})(\d{2})$/;
  const match = dateString.match(regex);

  if (!match) throw new Error("Format invalide");

  const [, year, month, day] = match;

  const yearInt = parseInt(year, 10);
  const monthInt = parseInt(month, 10);
  const dayInt = parseInt(day, 10);

  return new Date(Date.UTC(yearInt, monthInt - 1, dayInt));
}