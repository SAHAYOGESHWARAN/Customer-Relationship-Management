import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { AuthProvider } from '../context/AuthContext';
import axios from 'axios';

// Mocking axios
jest.mock('axios');

describe('Login Component', () => {
    test('renders login form', () => {
        render(
            <AuthProvider>
                <Login />
            </AuthProvider>
        );
        
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
    });

    test('submits login form and handles successful login', async () => {
        // Mocking the API response
        const mockUserData = {
            data: {
                token: 'mockToken',
                refreshToken: 'mockRefreshToken',
                user: { name: 'Test User', email: 'test@example.com' }
            }
        };

        axios.post.mockResolvedValueOnce(mockUserData);

        render(
            <AuthProvider>
                <Login />
            </AuthProvider>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
                email: 'test@example.com',
                password: 'password123'
            });
        });

        // Optionally check if the token and user are stored (depending on how AuthContext is structured)
        // This can vary based on how you expose the state from AuthContext
    });

    test('shows error message on login failure', async () => {
        // Mocking the API response to simulate login failure
        const errorMessage = 'Invalid credentials';
        axios.post.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

        render(
            <AuthProvider>
                <Login />
            </AuthProvider>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongPassword' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            // Check if error message is displayed (you may need to modify based on your implementation)
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
});
