import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Login';
import { AuthProvider } from '../context/AuthContext';

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

test('submits login form', () => {
    render(
        <AuthProvider>
            <Login />
        </AuthProvider>
    );
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen
