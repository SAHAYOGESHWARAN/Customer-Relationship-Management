import express from 'express';
import { uploadFile } from '../controllers/fileUploadController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { validateRequest } from '../middleware/validateRequest.js';
import { body } from 'express-validator'; // For validating file inputs

const router = express.Router();

// Set file size limits (e.g., 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types (you can extend this list based on your needs)
const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;

// Multer configuration for local storage (if not using S3)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

// Multer file filter to validate file types
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and documents are allowed.'), false);
    }
};

// Multer upload with limits and validation
const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
}).single('file');

// Middleware for file validation (validate max file size, required file)
const fileValidation = [
    body('file')
        .custom((value, { req }) => !!req.file)  // Ensure a file is uploaded
        .withMessage('File is required')
];

// Route for file upload (Authenticated users only)
router.post(
    '/upload',
    authMiddleware, // User must be authenticated
    (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Handle multer-specific errors (e.g., file too large)
                return res.status(400).json({ message: err.message });
            } else if (err) {
                // Handle other errors
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    },
    validateRequest,  // Custom validation middleware
    uploadFile
);

export default router;
