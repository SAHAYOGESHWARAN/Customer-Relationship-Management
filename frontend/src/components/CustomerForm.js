import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Snackbar, Alert } from '@mui/material';

const CustomerForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleValidation = () => {
        let tempErrors = {};
        let formIsValid = true;

        if (!formData.name) {
            formIsValid = false;
            tempErrors["name"] = "Name is required";
        }
        if (!formData.email) {
            formIsValid = false;
            tempErrors["email"] = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formIsValid = false;
            tempErrors["email"] = "Email is not valid";
        }
        if (!formData.phone) {
            formIsValid = false;
            tempErrors["phone"] = "Phone number is required";
        } else if (!/^\d+$/.test(formData.phone)) {
            formIsValid = false;
            tempErrors["phone"] = "Phone number must be numeric";
        }

        setErrors(tempErrors);
        return formIsValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setSnackbarMessage('');
        
        if (handleValidation()) {
            setLoading(true);
            axios.post('/api/customers', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => {
                    setSnackbarMessage('Customer added successfully!');
                    setOpenSnackbar(true);
                    setFormData({ name: '', email: '', phone: '', company: '', notes: '' }); // Clear form
                })
                .catch(err => {
                    setSnackbarMessage('Failed to add customer.');
                    setOpenSnackbar(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                    style={{ marginBottom: '15px' }}
                />
                <TextField
                    variant="outlined"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                    style={{ marginBottom: '15px' }}
                />
                <TextField
                    variant="outlined"
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.phone}
                    helperText={errors.phone}
                    style={{ marginBottom: '15px' }}
                />
                <TextField
                    variant="outlined"
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    fullWidth
                    style={{ marginBottom: '15px' }}
                />
                <TextField
                    variant="outlined"
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    style={{ marginBottom: '15px' }}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Customer'}
                </Button>
            </form>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CustomerForm;
