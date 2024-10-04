import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import logger from './utils/logger.js'; 
import connectDB from './config/db.js';


dotenv.config();

const app = express();
app.use(errorMiddleware);

// Middleware
app.use(express.json());
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
});
app.use(limiter);

// Logging all requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);

// Error Middleware (Logging errors)
app.use((err, req, res, next) => {
    logger.error(err.message);
    next(err);
});
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
});
