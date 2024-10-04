import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container } from '@mui/material';

const CustomerForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', notes: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/customers', formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                <Button variant="contained" color="primary" type="submit">
                    Add Customer
                </Button>
            </form>
        </Container>
    );
};

export default CustomerForm;
