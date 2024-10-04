import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let refreshTokens = [];

// Register a new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT access token
        const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_SECRET);

        // Store the refresh token
        refreshTokens.push(refreshToken);

        // Send the tokens and user details
        res.status(201).json({ user: newUser, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT access token
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET);

        // Store the refresh token
        refreshTokens.push(refreshToken);

        // Send the tokens and user details
        res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle refresh token generation
export const refreshToken = (req, res) => {
    const { token: refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: "No token provided" });
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: "Invalid refresh token" });

    try {
        // Verify the refresh token
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Generate a new access token
        const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the new access token
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};

// Logout (optional): Handle the removal of refresh tokens
export const logoutUser = (req, res) => {
    const { token: refreshToken } = req.body;

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    res.status(200).json({ message: "Logged out successfully" });
};
