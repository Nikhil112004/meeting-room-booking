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

const isInteger = (value) => Number.isInteger(Number(value));

const isPositiveInteger = (value) => isInteger(value) && Number(value) > 0;

const isValidTime = (time) => typeof time === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

const toUtcDate = (date) => new Date(`${date}T00:00:00.000Z`);

module.exports = {
    isValidDate,
    isInteger,
    isPositiveInteger,
    isValidTime,
    toUtcDate,
};
