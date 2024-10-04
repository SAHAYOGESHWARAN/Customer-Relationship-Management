import express from 'express';
import { createCustomer, getCustomers, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), createCustomer);  // Only admins can create customers
router.get('/', authMiddleware, getCustomers);  // Both admins and users can view customers
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateCustomer);  // Only admins can update
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteCustomer);  // Only admins can delete

export default router;
