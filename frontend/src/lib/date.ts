export function getLocalDateString(date = new Date()) {
  const localTime = date.getTime() - date.getTimezoneOffset() * 60_000;
  return new Date(localTime).toISOString().slice(0, 10);
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
