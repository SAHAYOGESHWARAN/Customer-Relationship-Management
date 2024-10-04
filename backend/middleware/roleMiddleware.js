const roleMiddleware = (requiredRole) => (req, res, next) => {
    const { role } = req.user; // Assume `role` is part of the JWT payload

    if (role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    next();
};

export default roleMiddleware;
