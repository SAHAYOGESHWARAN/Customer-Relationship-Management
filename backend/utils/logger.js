import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { Loggly } from 'winston-loggly-bulk';

const { combine, timestamp, printf, errors, colorize, json } = format;

// Custom log levels
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
    }
};

// Define log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

// Log file rotation for daily log files
const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: path.join('logs', 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d', // Keep logs for 14 days
    level: 'info',   // Only info level and below
});

// Create Winston logger instance
const logger = createLogger({
    levels: customLevels.levels, // Use custom levels
    format: combine(
        timestamp(),
        errors({ stack: true }), // Capture stack traces
        json() // Store logs in JSON format for external log analysis tools
    ),
    transports: [
        dailyRotateFileTransport, // Daily rotation
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // Error logs
        new transports.Console({
            format: combine(
                colorize({ all: true }), // Colorize logs
                logFormat
            ),
            level: 'debug', // Show all logs in development
        })
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' }), // Handle uncaught exceptions
    ]
});

// Enable Loggly remote logging in production
if (process.env.NODE_ENV === 'production') {
    logger.add(new Loggly({
        token: process.env.LOGGLY_TOKEN,
        subdomain: process.env.LOGGLY_SUBDOMAIN,
        tags: ["Winston-NodeJS"],
        json: true
    }));
}

// Enable colorized output in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(
            colorize(),
            logFormat
        ),
        level: 'debug', // Show detailed logs during development
    }));
}

export default logger;
