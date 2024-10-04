import { render, screen, waitFor } from '@testing-library/react';
import CustomerList from '../components/CustomerList';
import { AuthProvider } from '../context/AuthContext';
import axios from 'axios';

jest.mock('axios');

test('renders customer list', async () => {
    // Mock the API response
    axios.get.mockResolvedValue({
        data: {
            customers: [
                { id: 1, name: 'John Doe', email: 'john@example.com' },
                { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
            ],
        },
    });

    render(
        <AuthProvider>
            <CustomerList />
        </AuthProvider>
    );

    // Check if the loading spinner appears first
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for the data to load and check the customer names
    await waitFor(() => {
        expect(screen.getByText('saha')).toBeInTheDocument();
        expect(screen.getByText('yogesh')).toBeInTheDocument();
    });
});
