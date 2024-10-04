
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    company: { type: String },
    status: { type: String, default: 'Active' },
    notes: { type: String }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
