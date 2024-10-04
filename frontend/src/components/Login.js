import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Container,
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const history = useHistory();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Reset error state

        axios.post('/api/auth/login', formData)
            .then(res => {
                localStorage.setItem('token', res.data.token);
                console.log('User logged in');
                history.push('/dashboard'); // Redirect to dashboard
            })
            .catch(err => {
                console.error(err);
                setError('Invalid email or password. Please try again.');
                setOpenSnackbar(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '50px' }}>
            <Typography variant="h4" component="h1" align="center">Login</Typography>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                <TextField
                    variant="outlined"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    variant="outlined"
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="text"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ alignSelf: 'flex-end', marginBottom: '10px' }}
                >
                    {showPassword ? 'Hide Password' : 'Show Password'}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
            </form>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Login;
