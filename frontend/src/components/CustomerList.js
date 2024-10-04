import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('/api/customers', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => setCustomers(res.data))
            .catch(err => console.log(err));
    }, []);

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Customer List</h2>
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredCustomers.map(customer => (
                    <li key={customer._id}>{customer.name} - {customer.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerList;
