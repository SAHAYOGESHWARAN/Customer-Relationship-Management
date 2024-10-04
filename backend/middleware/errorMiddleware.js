import winston from 'winston';

// Configure a logger (you can replace or extend with other logging services)
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});

// Error-handling middleware
const errorMiddleware = (err, req, res, next) => {
    // Check if the response status is already set; otherwise, use 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Enhanced response structure for errors
    const errorResponse = {
        message: err.message || 'An unexpected error occurred',
        errorType: err.name || 'Error',
        statusCode,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    };

    // Log the error details (in production, logs can be sent to external services)
    logger.error({
        message: err.message,
        statusCode,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });

    // Send the error response to the client
    res.json(errorResponse);
};

export default errorMiddleware;
