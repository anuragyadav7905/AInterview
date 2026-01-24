const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Interview'
    },
    content: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    userAnswer: {
        type: String,
        default: ''
    },
    audioPath: {
        type: String,
        required: false
    },
    answeredAt: {
        type: Date
    },
    transcript: {
        type: String
    },
    confidence: {
        type: Number
    },
    audioDuration: {
        type: Number
    },
    score: {
        type: Number
    },
    feedback: {
        type: String
    },
    feedbackStrengths: {
        type: [String]
    },
    feedbackImprovements: {
        type: [String]
    },
    wpm: {
        type: Number
    },
    fillerCount: {
        type: Number
    },
    fillers: {
        type: [String]
    },
    voiceScore: {
        type: Number
    },
    finalScore: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
