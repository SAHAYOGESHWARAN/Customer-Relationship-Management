import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import Register from './components/Register';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Container } from '@mui/material';

const ProtectedRoute = ({ element }) => {
    const { user } = useAuth();
    return user ? element : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Container maxWidth="lg">
                    <h1>CRM System</h1>
                    <Routes>
                        <Route path="/" element={<CustomerList />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/add-customer" element={<ProtectedRoute element={<CustomerForm />} />} />
                    </Routes>
                </Container>
            </Router>
        </AuthProvider>
    );
}

export default App;
