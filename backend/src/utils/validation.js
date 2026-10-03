const isValidDate = (date) => {
    if (typeof date !== "string") return false;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
        return false;
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (Number.isNaN(parsedDate.getTime())) {
        return false;
    }

    const [year, month, day] = date.split("-").map(Number);

    return (
        parsedDate.getUTCFullYear() === year &&
        parsedDate.getUTCMonth() + 1 === month &&
        parsedDate.getUTCDate() === day
    );
};

const isInteger = (value) => {
    if (typeof value !== "number" && typeof value !== "string") return false;
    if (typeof value === "string" && value.trim() === "") return false;

    const number = Number(value);
    return Number.isSafeInteger(number) && number > 0;
};

const isPositiveInteger = (value) => isInteger(value) && Number(value) > 0;

const isValidTime = (time) => typeof time === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

const toUtcDate = (date) => new Date(`${date}T00:00:00.000Z`);

const getIndiaDateTime = (now = new Date()) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

    return {
        date: `${values.year}-${values.month}-${values.day}`,
        time: `${values.hour}:${values.minute}`,
        second: Number(values.second),
    };
};

const isPastDate = (date) => date < getIndiaDateTime().date;

const isPastDateTime = (date, time) => {
    const now = getIndiaDateTime();
    return date < now.date || (date === now.date && time <= now.time);
};

module.exports = {
    isValidDate,
    isInteger,
    isPositiveInteger,
    isValidTime,
    toUtcDate,
    getIndiaDateTime,
    isPastDate,
    isPastDateTime,
};
