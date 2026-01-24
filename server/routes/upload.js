const express = require('express');
const multer = require('multer');
const path = require('path');
const CV = require('../models/CV');
const Interview = require('../models/Interview'); // Added
const Question = require('../models/Question'); // Added
const { protect } = require('../middleware/authMiddleware');
const { extractText } = require('../services/cvExtractor');
const { parseCV } = require('../services/cvParser');
const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const mimetypes = /application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = mimetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: PDFs and DOCs only!');
        }
    }
});

// @desc    Get CV Suggestions based on Interview Performance
// @route   GET /api/upload-cv/suggestions
// @access  Private
router.get('/suggestions', protect, async (req, res) => {
    try {
        // 1. Fetch Latest CV
        const latestCV = await CV.findOne({ user: req.user._id }).sort({ uploadedAt: -1 });
        if (!latestCV) return res.json([]);

        const suggestions = [];

        // 2. Fetch Interview Stats (Quick Analysis)
        const recentInterviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5).select('_id');
        const interviewIds = recentInterviews.map(i => i._id);

        let lowContentCount = 0;
        if (interviewIds.length > 0) {
            const questions = await Question.find({ interview: { $in: interviewIds }, finalScore: { $exists: true } });
            questions.forEach(q => {
                if (q.score < 6) lowContentCount++;
            });
        }

        // 3. Logic: CV Content vs Matrix

        // A. Metrics Check
        const text = latestCV.extractedText || '';
        // Look for numbers, %, $
        const metricMatch = text.match(/\d+%|\$\d+|\d+ users|\d+ year|\d+x/g);
        const metricCount = metricMatch ? metricMatch.length : 0;

        if (metricCount < 3) {
            suggestions.push({
                section: "Experience",
                tip: "Your CV lacks measurable results. Add numbers (e.g., 'Improved efficiency by 20%', 'Managed team of 5') to prove your impact."
            });
        }

        // B. Technical Depth Check
        if (lowContentCount > 2) {
            suggestions.push({
                section: "Skills / Projects",
                tip: "Your interview answers often lack technical depth. Ensure your CV highlights specific technologies and complex problems you've solved, so you're better prepared to discuss them."
            });
        }

        // C. Action Verbs (Simple check)
        const weakVerbs = ['worked on', 'responsible for', 'helped', 'participated'];
        let weakVerbCount = 0;
        weakVerbs.forEach(verb => {
            if (new RegExp(`\\b${verb}\\b`, 'i').test(text)) weakVerbCount++;
        });

        if (weakVerbCount > 2) {
            suggestions.push({
                section: "General Phrasing",
                tip: "Replace passive phrases like 'worked on' or 'responsible for' with strong action verbs like 'Architected', 'Deployed', 'Optimized', or 'Spearheaded'."
            });
        }

        res.json(suggestions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Upload CV
// @route   POST /api/upload-cv
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        // Extract Text
        let text = '';
        try {
            text = await extractText(req.file.path);
        } catch (err) {
            console.error('Extraction Error:', err);
            // Continue even if extraction fails (store file path at least)
        }

        // Structure Data
        const structuredData = parseCV(text);

        const cv = await CV.create({
            user: req.user._id,
            fileName: req.file.originalname, // Maps to schema: fileName
            filePath: req.file.path,         // Maps to schema: filePath
            extractedText: text,
            structuredData
        });

        res.status(201).json(cv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Latest CV
// @route   GET /api/upload-cv/latest
// @access  Private
router.get('/latest', protect, async (req, res) => {
    try {
        const cv = await CV.findOne({ user: req.user._id }).sort({ uploadedAt: -1 });
        if (!cv) {
            return res.status(404).json({ message: 'No CV found' });
        }
        res.json(cv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
