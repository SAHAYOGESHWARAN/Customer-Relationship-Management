import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('token') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        setAccessToken(response.data.token);
        setRefreshToken(response.data.refreshToken);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
    };

    const refreshTokenFunction = async () => {
        const response = await axios.post('/api/auth/refresh-token', { token: refreshToken });
        setAccessToken(response.data.accessToken);
        localStorage.setItem('token', response.data.accessToken);
    };

    useEffect(() => {
        if (refreshToken) {
            const interval = setInterval(refreshTokenFunction, 55 * 60 * 1000);  // Refresh token every 55 minutes
            return () => clearInterval(interval);
        }
    }, [refreshToken]);

    return (
        <AuthContext.Provider value={{ user, login, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
