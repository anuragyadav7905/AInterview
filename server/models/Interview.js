const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cv: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'CV'
    },
    role: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard']
    },
    style: {
        type: String,
        required: true,
        enum: ['Friendly', 'Strict', 'Technical', 'HR']
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
