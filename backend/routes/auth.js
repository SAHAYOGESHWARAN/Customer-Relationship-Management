import express from 'express';
import { loginUser, registerUser, refreshToken } from '../controllers/authController.js';
import rateLimit from 'express-rate-limit';  // Rate limiter to prevent brute-force attacks
import { body } from 'express-validator';   // Input validation using express-validator
import { validateRequest } from '../middleware/validateRequest.js';  // Custom middleware for request validation

const router = express.Router();

// Rate limiting for authentication routes (e.g., 5 requests per minute per IP)
const loginLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute window
    max: 5,               // limit each IP to 5 login requests per windowMs
    message: "Too many login attempts from this IP, please try again after a minute"
});

// Register route with input validation
router.post(
    '/register',
    [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 3 })
            .withMessage('Name must be at least 3 characters long'),
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),
    ],
    validateRequest, // Middleware to handle validation errors
    registerUser
);

// Login route with rate limiting and input validation
router.post(
    '/login',
    loginLimiter, // Apply rate limiting
    [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],
    validateRequest, // Middleware to handle validation errors
    loginUser
);

// Refresh token route (for refreshing access tokens)
router.post('/refresh-token', refreshToken);

export default router;
