import mongoose from 'mongoose';

// Define the customer schema
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']  // Email validation using regex
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']  // E.164 phone number validation
    },
    company: {
        type: String,
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Lead'],  // Limit status to specific values
        default: 'Active'
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
        trim: true
    }
}, { 
    timestamps: true,  // Automatically add createdAt and updatedAt timestamps
    toJSON: { virtuals: true },  // Ensure virtuals are included when converting to JSON
    toObject: { virtuals: true }
});

// Index to improve performance on common queries
customerSchema.index({ email: 1, phone: 1 }, { unique: true });

// Virtual field for full contact details (example of using virtuals)
customerSchema.virtual('contactDetails').get(function() {
    return `${this.name} (${this.email}, ${this.phone})`;
});

// Pre-save hook to perform additional tasks before saving (example)
customerSchema.pre('save', function(next) {
    console.log(`Customer ${this.name} is about to be saved`);
    next();
});

// Static method to find active customers
customerSchema.statics.findActive = function() {
    return this.find({ status: 'Active' });
};

// Instance method to deactivate a customer
customerSchema.methods.deactivate = function() {
    this.status = 'Inactive';
    return this.save();
};

// Middleware to sanitize inputs (prevent XSS and similar attacks)
customerSchema.pre('validate', function(next) {
    if (this.name) {
        this.name = this.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");  // Basic XSS prevention
    }
    next();
});

// Define the Customer model
const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
