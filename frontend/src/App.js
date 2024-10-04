import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';

function App() {
    return (
        <Router>
            <div>
                <h1>CRM System</h1>
                <Routes>
                    <Route path="/" element={<CustomerList />} />
                    <Route path="/add-customer" element={<CustomerForm />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
