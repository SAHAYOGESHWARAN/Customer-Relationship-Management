import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Button,
    Container,
    Pagination,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null); // Reset error on new request

        axios.get(`/api/customers?page=${page}&search=${searchTerm}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setCustomers(res.data.customers);
                setTotalPages(res.data.totalPages);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to fetch customers.');
                setOpenSnackbar(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page, searchTerm]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container>
            <h2>Customer List</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <TextField
                    variant="outlined"
                    label="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClearSearch}
                    style={{ marginLeft: '10px' }}
                >
                    Clear
                </Button>
            </div>

            {loading ? (
                <CircularProgress />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.length > 0 ? (
                            customers.map(customer => (
                                <TableRow key={customer._id}>
                                    <TableCell>{customer.name}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">No customers found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: '20px' }}
            />

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CustomerList;
