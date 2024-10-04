import express from 'express';
import { uploadFile } from '../controllers/fileUploadController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// File upload route
router.post('/upload', authMiddleware, uploadFile);

export default router;
