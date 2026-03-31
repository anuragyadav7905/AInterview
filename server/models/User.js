const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false  // Google users won't have a password
    },
    googleId: {
        type: String,
        sparse: true     // allows multiple null values
    },
    avatar: {
        type: String
    },
    preferences: {
        notifications: { type: Boolean, default: true },
        persona: { type: String, default: 'Professional' }
    }
});

// Only hash password if it exists and was modified
userSchema.pre('save', async function (next) {
    if (!this.password || !this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
