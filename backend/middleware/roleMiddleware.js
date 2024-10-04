import winston from 'winston';

// Configure a logger for monitoring access control
const logger = winston.createLogger({
    level: 'warn', // Log warnings for unauthorized access attempts
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/access.log', level: 'warn' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});

// Middleware to enforce role-based access control
const roleMiddleware = (requiredRoles) => (req, res, next) => {
    const { role } = req.user;  // Assume `role` is part of the JWT payload
    
    // Convert single role to an array for flexibility
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // Check if the user's role matches any of the required roles
    if (!rolesArray.includes(role)) {
        // Log the unauthorized access attempt
        logger.warn({
            message: 'Unauthorized access attempt',
            userRole: role,
            requiredRoles: rolesArray,
            url: req.originalUrl,
            method: req.method,
            userId: req.user.id,  // Assumes user ID is part of JWT
            timestamp: new Date().toISOString(),
            ip: req.ip
        });

        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    // Proceed if the role matches
    next();
};

export default roleMiddleware;
