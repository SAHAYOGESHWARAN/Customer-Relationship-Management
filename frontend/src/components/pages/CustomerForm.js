
import React, { useState } from 'react';
import axios from 'axios';

const CustomerForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', notes: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/customers', formData)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
            <input type="text" name="company" placeholder="Company" onChange={handleChange} />
            <textarea name="notes" placeholder="Notes" onChange={handleChange}></textarea>
            <button type="submit">Add Customer</button>
        </form>
    );
};

export default CustomerForm;
