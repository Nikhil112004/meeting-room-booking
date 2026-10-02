const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.statusCode && err.statusCode < 500) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};

module.exports = errorHandler;
