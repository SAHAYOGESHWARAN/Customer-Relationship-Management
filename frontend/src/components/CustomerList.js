import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Container, Pagination } from '@mui/material';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        axios.get(`/api/customers?page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setCustomers(res.data.customers);
                setTotalPages(res.data.totalPages);
            })
            .catch(err => console.log(err));
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Container>
            <h2>Customer List</h2>
            <TextField
                variant="outlined"
                label="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {customers.map(customer => (
                        <TableRow key={customer._id}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: '20px' }}
            />
        </Container>
    );
};

export default CustomerList;
