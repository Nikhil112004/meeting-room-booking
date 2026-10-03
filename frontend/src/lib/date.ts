export function getLocalDateString(date = new Date()) {
  const localTime = date.getTime() - date.getTimezoneOffset() * 60_000;
  return new Date(localTime).toISOString().slice(0, 10);
}

export function getIndiaDateTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${value("year")}-${value("month")}-${value("day")}`,
    time: `${value("hour")}:${value("minute")}`,
    second: Number(value("second")),
  };
}

export function isBookingDateTimePast(date: string, time: string) {
  const now = getIndiaDateTime();
  return date < now.date || (date === now.date && time <= now.time);
}

function parseDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

export function formatDateLabel(value: string) {
  if (!value) return "Choose a date";
  return new Intl.DateTimeFormat("en", {
    weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(parseDate(value));
}

export function formatShortDate(value: string) {
  if (!value) return "Choose a date";
  return new Intl.DateTimeFormat("en", {
    month: "short", day: "2-digit", year: "numeric", timeZone: "UTC",
  }).format(parseDate(value));
}
