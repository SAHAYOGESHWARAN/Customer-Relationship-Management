import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';  // For advanced email validation

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email address']  // Email validation using validator.js
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false  // Ensures password is not returned in queries
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'super-admin'],  // Roles to control user permissions
        default: 'user'
    },
    resetPasswordToken: String,  // For password reset functionality
    resetPasswordExpires: Date
}, { 
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Index for better query performance and to ensure uniqueness
userSchema.index({ email: 1 });

// Pre-save hook to hash passwords before saving to the database
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    // Hash the password before saving
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
    return this.find({ role });
};

// Instance method to promote a user to a higher role
userSchema.methods.promote = function(newRole) {
    this.role = newRole;
    return this.save();
};

// Virtual field to return the user's profile information without exposing sensitive data
userSchema.virtual('profile').get(function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        role: this.role
    };
});

// Middleware to sanitize input to prevent XSS attacks
userSchema.pre('validate', function(next) {
    if (this.name) {
        this.name = this.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');  // Prevent XSS in name field
    }
    next();
});

// Method to generate a password reset token
userSchema.methods.generatePasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;  // Token valid for 10 minutes

    return resetToken;
};

// Define the User model
const User = mongoose.model('User', userSchema);

export default User;
