export function formatDateHours(date) {
    const d = date instanceof Date ? date : new Date(date);

    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function timeOfProgram(startDate, stopDate) {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const stop = stopDate instanceof Date ? stopDate : new Date(stopDate);

    const diffInMinutes = Math.round((stop - start) / 60000);
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

export function getProgress(startDate, endDate, now = Date.now()) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (isNaN(start) || isNaN(end)) return 0;
  if (end <= start) return end === start && now >= end ? 100 : 0;

  const pct = ((now - start) / (end - start)) * 100;

  return Math.max(0, Math.min(100, Number(pct.toFixed(2))));
}