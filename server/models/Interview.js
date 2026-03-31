const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cv: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'CV'
    },
    role: {
        type: String,
        required: true,
        default: 'General'
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard', 'Adaptive'],
        default: 'Medium'
    },
    style: {
        type: String,
        required: true,
        default: 'Professional'
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    averageScore: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
