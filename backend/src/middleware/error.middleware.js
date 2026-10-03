const errorHandler = (err, req, res, next) => {
    const malformedJson = err instanceof SyntaxError && err.status === 400;
    const statusCode = err.code === "P1001" ? 503 : err.statusCode || err.status || 500;

    // Database outages are operational failures; log a compact record so the
    // terminal shows the useful cause without dumping Prisma's whole stack.
    console.error("[api:error]", {
        method: req.method,
        path: req.originalUrl,
        code: err.code || "UNEXPECTED_ERROR",
        message: err.code === "P1001" ? "Cannot reach the configured PostgreSQL server" : err.message,
    });

    if (err.code === "P1001") {
        return res.status(503).json({
            success: false,
            message: "Database is temporarily unavailable. Please retry in a moment.",
        });
    }

    if (malformedJson) {
        return res.status(400).json({
            success: false,
            message: "Request body must contain valid JSON",
        });
    }

    if (statusCode < 500) {
        return res.status(statusCode).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(statusCode).json({
        success: false,
        message: "Internal server error"
    });
};

module.exports = errorHandler;
