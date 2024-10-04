import express from 'express';
import { loginUser, registerUser, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);  // New route for token refresh

export default router;
