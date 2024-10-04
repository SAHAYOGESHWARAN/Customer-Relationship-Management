import Customer from '../models/Customer.js';
import { sendEmail } from '../utils/emailService.js';

// Create a new customer
export const createCustomer = async (req, res) => {
    const { name, email, phone, company, notes } = req.body;

    try {
        // Create a new customer
        const newCustomer = await Customer.create({ name, email, phone, company, notes });

        // Send email notification after customer creation
        sendEmail(email, 'Welcome!', `Hello ${name}, welcome to our service!`);

        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch all customers with pagination
export const getCustomers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        // Fetch paginated customers
        const customers = await Customer.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        // Get total count of customers
        const count = await Customer.countDocuments();

        res.json({
            customers,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update customer
export const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, company, status, notes } = req.body;

    try {
        // Find and update the customer by ID
        const updatedCustomer = await Customer.findByIdAndUpdate(id, {
            name, email, phone, company, status, notes
        }, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the customer by ID
        const deletedCustomer = await Customer.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
