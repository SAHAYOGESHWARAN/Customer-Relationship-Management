
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get('/api/customers')
            .then(res => setCustomers(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h2>Customer List</h2>
            <ul>
                {customers.map(customer => (
                    <li key={customer._id}>{customer.name} - {customer.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerList;
