import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('token') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to handle login
    const login = async (email, password) => {
        setLoading(true);
        setError(null); // Reset any previous error

        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, refreshToken, user } = response.data;

            setAccessToken(token);
            setRefreshToken(refreshToken);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle logout
    const logout = () => {
        setAccessToken('');
        setRefreshToken('');
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    // Function to refresh the access token
    const refreshTokenFunction = useCallback(async () => {
        if (!refreshToken) return;

        try {
            const response = await axios.post('/api/auth/refresh-token', { token: refreshToken });
            setAccessToken(response.data.accessToken);
            localStorage.setItem('token', response.data.accessToken);
        } catch (err) {
            console.error('Error refreshing token:', err);
            logout(); // Log out if refreshing token fails
        }
    }, [refreshToken]);

    // Setting up the token refresh interval
    useEffect(() => {
        if (refreshToken) {
            const interval = setInterval(refreshTokenFunction, 55 * 60 * 1000); // Refresh token every 55 minutes
            return () => clearInterval(interval);
        }
    }, [refreshToken, refreshTokenFunction]);

    // Load user info if token is available
    useEffect(() => {
        if (accessToken) {
            const fetchUser = async () => {
                try {
                    const response = await axios.get('/api/user', { headers: { Authorization: `Bearer ${accessToken}` } });
                    setUser(response.data);
                } catch (err) {
                    console.error('Error fetching user:', err);
                    logout(); // Log out if fetching user fails
                }
                setLoading(false);
            };

            fetchUser();
        } else {
            setLoading(false);
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ user, login, logout, accessToken, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
