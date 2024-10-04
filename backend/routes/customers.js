import express from 'express';
import { createCustomer, getCustomers, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { body, param } from 'express-validator'; // Input validation
import { validateRequest } from '../middleware/validateRequest.js'; // Middleware for validation
import rateLimit from 'express-rate-limit'; // Rate limiting for create/update/delete routes

const router = express.Router();

// Rate limiter (10 requests per minute per IP for sensitive routes like creating/updating customers)
const customerRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: "Too many requests, please try again after a minute."
});

// Input validation for creating/updating customer
const customerValidation = [
    body('name')
        .notEmpty()
        .withMessage('Customer name is required'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('phone')
        .notEmpty()
        .withMessage('Phone number is required')
];

// Route to create a new customer (Only for admin roles)
router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    customerRateLimiter,  // Apply rate limiting
    customerValidation,   // Apply validation
    validateRequest,      // Custom middleware to handle validation errors
    createCustomer
);

// Route to fetch all customers (Admins and users can access)
router.get(
    '/',
    authMiddleware,
    [
        // Pagination validation
        param('page').optional().isInt({ gt: 0 }).withMessage('Page must be a positive integer'),
        param('limit').optional().isInt({ gt: 0 }).withMessage('Limit must be a positive integer')
    ],
    validateRequest,
    getCustomers
);

// Route to update a customer (Only for admin roles)
router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    customerRateLimiter,  // Apply rate limiting
    [
        param('id')
            .isMongoId()
            .withMessage('Invalid customer ID format'),
        ...customerValidation // Reuse the same customer validation for updates
    ],
    validateRequest,
    updateCustomer
);

// Route to delete a customer (Only for admin roles)
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    customerRateLimiter,  // Apply rate limiting
    param('id')
        .isMongoId()
        .withMessage('Invalid customer ID format'),
    validateRequest,
    deleteCustomer
);

export default router;
