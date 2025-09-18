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