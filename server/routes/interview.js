const express = require('express');
const multer = require('multer');
const path = require('path');
const Interview = require('../models/Interview');
const Question = require('../models/Question');
const CV = require('../models/CV');
const { protect } = require('../middleware/authMiddleware');
const { generateInterviewQuestion, evaluateAnswer, transcribeWithGemini } = require('../services/geminiService');

const router = express.Router();

// Memory storage multer for audio uploads
const audioUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// @desc    Start new interview
// @route   POST /api/interview/start
// @access  Private
router.post('/start', protect, async (req, res) => {
    const { cvId } = req.body; // cvId is optional

    try {
        let actualCvId = null;
        if (cvId) {
            const cv = await CV.findById(cvId);
            if (cv && cv.user.toString() === req.user._id.toString()) {
                actualCvId = cv._id;
            }
        }

        const interview = await Interview.create({
            user: req.user._id,
            cv: actualCvId, // Will be null if not provided
            role: 'General Software Engineer', // using defaults
            difficulty: 'Adaptive',
            style: 'Friendly'
        });

        res.status(201).json({
            message: 'Interview started',
            interviewId: interview._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Generate Next Question for Interview
// @route   POST /api/interview/:id/questions
// @access  Private
router.post('/:id/questions', protect, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id).populate('cv');
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        const existingQuestions = await Question.find({ interview: interview._id }).sort({ order: 1 });
        const questionNumber = existingQuestions.length + 1;
        const totalQuestions = 5;

        let cvData = null;
        if (interview.cv) {
            cvData = interview.cv.structuredData || interview.cv.parsedText || "Software Engineer passing CV";
        }

        let previousQA = existingQuestions.map(q => `Q: ${q.content}\nA: ${q.transcript || "(No answer provided)"}`).join('\n\n');

        const nextQuestionText = await generateInterviewQuestion(cvData, previousQA, questionNumber, totalQuestions);

        const newQuestion = await Question.create({
            interview: interview._id,
            content: nextQuestionText,
            order: questionNumber
        });

        res.json({ question: newQuestion.content, questionId: newQuestion._id });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Evaluate Answer
// @route   POST /api/interview/evaluate
// @access  Private
router.post('/evaluate', protect, async (req, res) => {
    try {
        const { answer, interviewId } = req.body;

        const interview = await Interview.findById(interviewId).populate('cv');
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Find the last unanswered question
        const latestQuestion = await Question.findOne({ interview: interviewId }).sort({ order: -1 });
        if (!latestQuestion) {
             return res.status(400).json({ message: 'No pending question found to evaluate.' });
        }

        let cvContext = interview.cv ? JSON.stringify(interview.cv.structuredData) : null;
        
        const evaluation = await evaluateAnswer(latestQuestion.content, answer, cvContext);

        latestQuestion.transcript = answer;
        latestQuestion.score = evaluation.score;
        latestQuestion.feedback = evaluation.feedback;
        latestQuestion.feedbackStrengths = [evaluation.strength];
        latestQuestion.feedbackImprovements = [evaluation.improvement];
        latestQuestion.answeredAt = new Date();
        // Fallback for missing final score calculations if necessary
        latestQuestion.finalScore = evaluation.score; 

        await latestQuestion.save();

        // Recursively update interview averagescore
        const allScored = await Question.find({ interview: interviewId, finalScore: { $exists: true } });
        if (allScored.length > 0) {
            const sum = allScored.reduce((acc, q) => acc + q.finalScore, 0);
            await Interview.findByIdAndUpdate(interviewId, { averageScore: Math.round((sum / allScored.length) * 10) / 10 });
        }

        res.json({
            message: 'Evaluation complete',
            evaluation: {
                 score: evaluation.score,
                 strength: evaluation.strength,
                 improvement: evaluation.improvement,
                 feedback: evaluation.feedback,
                 modelAnswer: evaluation.modelAnswer
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Interview Summary
// @route   GET /api/interview/:id/summary
// @access  Private
router.get('/:id/summary', protect, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        const questions = await Question.find({ interview: req.params.id }).sort({ order: 1 });
        
        let strengths = [];
        let improvements = [];
        questions.forEach(q => {
            if (q.feedbackStrengths && q.feedbackStrengths.length > 0) strengths.push(...q.feedbackStrengths);
            if (q.feedbackImprovements && q.feedbackImprovements.length > 0) improvements.push(...q.feedbackImprovements);
        });

        res.json({
            interview,
            questions,
            summaryData: {
                strengths: strengths.slice(0, 3), // top 3
                improvements: improvements.slice(0, 3) // top 3
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Transcribe audio using Gemini
// @route   POST /api/interview/transcribe
// @access  Private
router.post('/transcribe', protect, audioUpload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No audio file provided' });
    }
    try {
        const audioBase64 = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype || 'audio/webm';
        const transcript = await transcribeWithGemini(audioBase64, mimeType);
        res.json({ transcript });
    } catch (error) {
        res.status(500).json({ message: 'Transcription failed', error: error.message });
    }
});

// @desc    Mark interview as completed
// @route   POST /api/interview/:id/complete
// @access  Private
router.post('/:id/complete', protect, async (req, res) => {
    try {
        const interview = await Interview.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { status: 'completed' },
            { new: true }
        );
        if (!interview) return res.status(404).json({ message: 'Interview not found' });
        res.json({ message: 'Interview completed', interview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Keep other basic routes (history, progress) minimal for now as requested by user constraints
router.get('/history', protect, async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(interviews);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/progress', protect, async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user._id, averageScore: { $gt: 0 } }).sort({ createdAt: 1 }).select('averageScore createdAt');
        res.json(interviews.map(i => ({ date: i.createdAt.toISOString().split('T')[0], score: i.averageScore })));
    } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
