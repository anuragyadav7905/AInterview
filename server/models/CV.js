const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: false
    },
    extractedText: {
        type: String,
        required: false
    },
    structuredData: {
        name: String,
        email: String,
        phone: String,
        education: String,
        experience: String,
        skills: String,
        projects: String
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const CV = mongoose.model('CV', cvSchema);

module.exports = CV;
