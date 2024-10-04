import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import fileUploadRoutes from './routes/fileUpload.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import logger from './utils/logger.js';
import connectDB from './config/db.js';
import roleMiddleware from './middleware/roleMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Apply security headers using Helmet
app.use(helmet());

// Enable CORS for all routes
const corsOptions = {
    origin: process.env.CLIENT_URL || '*', // Allow requests from a specified origin
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));

// Apply gzip compression to reduce response size and improve speed
app.use(compression());

// Rate Limiting to avoid DDOS attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use('/api/', limiter);

// Logging all requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Middleware to parse incoming requests
app.use(express.json());

// Role-Based Access Control Routes
app.get('/admin-only', roleMiddleware('admin'), (req, res) => {
    res.send('Welcome Admin');
});

app.get('/admin-or-moderator', roleMiddleware(['admin', 'moderator']), (req, res) => {
    res.send('Welcome Admin or Moderator');
});

// Application routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', fileUploadRoutes);

// Global Error Handling Middleware
app.use(errorMiddleware);

// Custom 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error logging middleware (can be merged with existing error middleware for better error tracking)
app.use((err, req, res, next) => {
    logger.error(err.stack); // Log full error stack
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
