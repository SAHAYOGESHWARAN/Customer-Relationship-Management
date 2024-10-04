import jwt from 'jsonwebtoken';
import { authMiddleware } from './middlewares/authMiddleware.js';
import roleMiddleware from './middlewares/roleMiddleware.js';

app.post('/admin', authMiddleware, roleMiddleware('admin'), (req, res) => {
    res.send('Admin access granted');
});





// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
};

// Middleware for verifying the token
const authMiddleware = (req, res, next) => {
    // Extract token from the Authorization header
    const authHeader = req.headers.authorization;
    
    // Ensure the token is provided in the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user information from token to the request object
        req.userId = decoded.id;
        req.userRole = decoded.role;  // Extract role from the JWT

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Token is invalid or expired
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export { generateToken, authMiddleware };
