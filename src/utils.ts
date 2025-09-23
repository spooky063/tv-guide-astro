import { TZDate } from "@date-fns/tz";

export function formatDateHours(date: string | Date): string {
    const d = date instanceof Date ? date : new Date(date);

    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function timeOfProgram(startDate: string | Date, stopDate: string | Date): string {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const stop = stopDate instanceof Date ? stopDate : new Date(stopDate);
    const diff = stop.getTime() - start.getTime();

    const diffInMinutes = Math.round(diff / 60000);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (hours === 0) {
        return `${minutes} min`;
    } else if (minutes === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h${minutes.toString().padStart(2, "0")}`;
    }
}

export function parseDate(dateString: string): Date {
  const regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
  const match = dateString.match(regex);

  if (!match) throw new Error("Format invalide");

  const [, year, month, day, hour, minute, second] = match;

  const yearInt = parseInt(year, 10);
  const monthInt = parseInt(month, 10);
  const dayInt = parseInt(day, 10);
  const hourInt = parseInt(hour, 10);
  const minuteInt = parseInt(minute, 10);
  const secondInt = parseInt(second, 10);

  return new TZDate(yearInt, monthInt - 1, dayInt, hourInt, minuteInt, secondInt, "Europe/Paris");
}