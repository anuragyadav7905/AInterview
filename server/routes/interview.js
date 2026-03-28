const express = require('express');
const multer = require('multer');
const path = require('path');
const Interview = require('../models/Interview');
const Question = require('../models/Question');
const CV = require('../models/CV');
const { protect } = require('../middleware/authMiddleware');
const { generateQuestions } = require('../services/questionGenerator');
const { transcribeAudio } = require('../services/sttService');
const { evaluateAnswer } = require('../services/evaluationService');
const { analyzeVoice } = require('../services/voiceAnalysisService');
const router = express.Router();

// @desc    Start new interview
// @route   POST /api/interview/start
// @access  Private
router.post('/start', protect, async (req, res) => {
    const { role, difficulty, style } = req.body;

    if (!role || !difficulty || !style) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        // Find latest CV
        const latestCV = await CV.findOne({ user: req.user._id }).sort({ uploadedAt: -1 });

        if (!latestCV) {
            return res.status(400).json({ message: 'Please upload a CV first' });
        }

        const interview = await Interview.create({
            user: req.user._id,
            cv: latestCV._id,
            role,
            difficulty,
            style
        });

        res.status(201).json({
            message: 'Interview started',
            interviewId: interview._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Start Practice Session
// @route   POST /api/interview/practice
// @access  Private
router.post('/practice', protect, async (req, res) => {
    try {
        // 1. Analyze Weaknesses (Duplicate logic from /weakness for now, ideally refactor)
        // Fetch last 5 interviews
        const recentInterviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5).select('_id');
        const interviewIds = recentInterviews.map(i => i._id);

        let focus = "General Practice"; // Default

        if (interviewIds.length > 0) {
            const questions = await Question.find({ interview: { $in: interviewIds }, finalScore: { $exists: true } });

            let lowContent = 0, highFillers = 0, fastPace = 0, slowPace = 0, lowVoice = 0;
            questions.forEach(q => {
                if (q.score < 6) lowContent++;
                if (q.voiceScore < 6) lowVoice++;
                if (q.fillerCount > 2) highFillers++;
                if (q.wpm > 160) fastPace++;
                if (q.wpm < 100) slowPace++;
            });

            // Rudimentary priority
            if (lowContent > highFillers) focus = "Technical Depth";
            else if (highFillers > fastPace) focus = "Filler Words";
            else if (fastPace > slowPace) focus = "Speaking Speed (Fast)";
            else if (slowPace > 0) focus = "Speaking Speed (Slow)";
            else if (lowVoice > 0) focus = "Voice Delivery";
        }

        // 2. Find CV
        const latestCV = await CV.findOne({ user: req.user._id }).sort({ uploadedAt: -1 });
        if (!latestCV) return res.status(400).json({ message: 'Upload CV first' });

        // 3. Create Interview
        const interview = await Interview.create({
            user: req.user._id,
            cv: latestCV._id,
            role: `Practice: ${focus}`,
            difficulty: 'Adaptive',
            style: 'Focused',
            focusArea: focus // Add this field to model implicitly or handle in questions route
        });

        res.status(201).json({
            message: 'Practice session started',
            interviewId: interview._id,
            focus
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @desc    Generate Questions for Interview
// @route   POST /api/interview/:id/questions
// @access  Private
router.post('/:id/questions', protect, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id).populate('cv');
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Check if questions already exist
        const existingQuestions = await Question.find({ interview: interview._id }).sort({ order: 1 });
        if (existingQuestions.length > 0) {
            return res.json(existingQuestions);
        }

        // Determine Focus from Role if it's a practice session
        let focus = null;
        if (interview.role.startsWith("Practice: ")) {
            focus = interview.role.replace("Practice: ", "");
        }

        // Generate Questions
        const questionsList = generateQuestions(
            interview.role,
            interview.difficulty,
            interview.style,
            interview.cv,
            focus // Pass focus
        );

        // Save to DB
        const questionDocs = questionsList.map((q, index) => ({
            interview: interview._id,
            content: q,
            order: index + 1
        }));

        const savedQuestions = await Question.insertMany(questionDocs);
        res.json(savedQuestions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Evaluate Answer
// @route   POST /api/interview/evaluate
// @access  Private
router.post('/evaluate', protect, async (req, res) => {
    try {
        const { questionId, interviewId } = req.body;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        if (!question.transcript) {
            return res.status(400).json({ message: 'No transcript available for evaluation' });
        }

        const interview = await Interview.findById(interviewId); // Fetch interview to get style

        // Perform Evaluation (Content)
        const evaluation = await evaluateAnswer(question.content, question.transcript, interview ? interview.style : "Professional");

        // Perform Voice Analysis
        const voiceMetrics = analyzeVoice(question.transcript, question.audioDuration);

        // --- Calculate Voice Score ---
        // Base: 10
        // Penalty: -1 per 2 fillers
        // Penalty: -2 if WPM < 100 or WPM > 160
        let voiceScoreBase = 10;
        const fillerPenalty = Math.floor(voiceMetrics.fillerCount / 2);
        let speedPenalty = 0;
        if (voiceMetrics.wpm < 100 || voiceMetrics.wpm > 160) {
            speedPenalty = 2;
        }

        let voiceScore = voiceScoreBase - fillerPenalty - speedPenalty;
        if (voiceScore < 1) voiceScore = 1; // Minimum score
        if (voiceScore > 10) voiceScore = 10; // Max cap (just in case)

        // --- Calculate Final Score ---
        // Content: 70%, Voice: 30%
        // evaluation.score is the Content Score
        const finalScore = Math.round(((evaluation.score * 0.7) + (voiceScore * 0.3)) * 10) / 10; // Round to 1 decimal

        question.score = evaluation.score; // Content Score
        question.feedback = evaluation.feedback;
        question.feedbackStrengths = evaluation.feedbackStrengths;
        question.feedbackImprovements = evaluation.feedbackImprovements;

        question.wpm = voiceMetrics.wpm;
        question.fillerCount = voiceMetrics.fillerCount;
        question.fillers = voiceMetrics.fillers;

        question.voiceScore = voiceScore;
        question.finalScore = finalScore;

        await question.save();

        // --- Update Interview Average ---
        const allQuestions = await Question.find({ interview: interviewId, finalScore: { $exists: true } });
        const totalScore = allQuestions.reduce((sum, q) => sum + (q.finalScore || 0), 0);
        const averageScore = allQuestions.length > 0 ? (totalScore / allQuestions.length).toFixed(1) : 0;

        await Interview.findByIdAndUpdate(interviewId, { averageScore: Number(averageScore) });

        res.json({
            ...evaluation,
            ...voiceMetrics,
            voiceScore,
            finalScore,
            averageScore
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

        // Filter answered questions
        const answeredQuestions = questions.filter(q => q.finalScore !== undefined);

        let bestAnswer = null;
        let worstAnswer = null;
        let highFillerCount = 0;
        let fastPaceCount = 0;
        let slowPaceCount = 0;

        if (answeredQuestions.length > 0) {
            // Find Best/Worst
            bestAnswer = answeredQuestions.reduce((prev, current) => (prev.finalScore > current.finalScore) ? prev : current);
            worstAnswer = answeredQuestions.reduce((prev, current) => (prev.finalScore < current.finalScore) ? prev : current);

            // Analyze Trends
            answeredQuestions.forEach(q => {
                if (q.fillerCount > 2) highFillerCount++;
                if (q.wpm > 160) fastPaceCount++;
                if (q.wpm < 100) slowPaceCount++;
            });
        }

        const commonIssues = [];
        const threshold = answeredQuestions.length / 2;

        if (highFillerCount > threshold) commonIssues.push("Frequent use of filler words (um, uh, like).");
        if (fastPaceCount > threshold) commonIssues.push("Tendency to speak too fast (>160 WPM).");
        if (slowPaceCount > threshold) commonIssues.push("Speaking pace is quite slow (<100 WPM).");
        if (answeredQuestions.some(q => q.score < 5)) commonIssues.push("Some answers lacked sufficient technical depth.");

        res.json({
            interview,
            questions,
            highlights: {
                bestAnswer: bestAnswer ? { question: bestAnswer.content, score: bestAnswer.finalScore, id: bestAnswer._id } : null,
                worstAnswer: worstAnswer ? { question: worstAnswer.content, score: worstAnswer.finalScore, id: worstAnswer._id } : null
            },
            feedback: commonIssues
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Interview History
// @route   GET /api/interview/history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select('_id role difficulty averageScore createdAt status');

        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Interview Progress (Scores over time)
// @route   GET /api/interview/progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
    try {
        const interviews = await Interview.find({
            user: req.user._id,
            averageScore: { $gt: 0 } // Only include scored interviews
        })
            .sort({ createdAt: 1 }) // Chronological order
            .select('averageScore createdAt');

        const progressData = interviews.map(interview => ({
            date: interview.createdAt.toISOString().split('T')[0], // YYYY-MM-DD
            score: interview.averageScore
        }));

        res.json(progressData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Weakness Analysis (Pattern Recognition)
// @route   GET /api/interview/weakness
// @access  Private
router.get('/weakness', protect, async (req, res) => {
    try {
        // Fetch last 5 interviews
        const recentInterviews = await Interview.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('_id');

        const interviewIds = recentInterviews.map(i => i._id);

        if (interviewIds.length === 0) {
            return res.json([]);
        }

        // Fetch all questions for these interviews
        const questions = await Question.find({
            interview: { $in: interviewIds },
            finalScore: { $exists: true }
        });

        if (questions.length === 0) {
            return res.json([]);
        }

        // Initialize counters
        let lowContentCount = 0;
        let lowVoiceCount = 0;
        let highFillerCount = 0;
        let fastPaceCount = 0;
        let slowPaceCount = 0;

        questions.forEach(q => {
            if (q.score < 6) lowContentCount++;
            if (q.voiceScore < 6) lowVoiceCount++;
            if (q.fillerCount > 2) highFillerCount++;
            if (q.wpm > 160) fastPaceCount++;
            if (q.wpm < 100) slowPaceCount++;
        });

        // Determine Weaknesses
        const weaknesses = [];
        const totalQ = questions.length;
        const threshold = Math.ceil(totalQ * 0.3); // 30% of questions trigger weakness

        if (lowContentCount >= threshold) {
            weaknesses.push({
                issue: "Technical Depth",
                tip: "Your answers often lack specific details or deep technical explanation. Try using the STAR method."
            });
        }
        if (highFillerCount >= threshold) {
            weaknesses.push({
                issue: "Filler Words",
                tip: "You use 'um', 'uh', or 'like' frequently. Pause silently instead of using fillers."
            });
        }
        if (fastPaceCount >= threshold) {
            weaknesses.push({
                issue: "Speaking Speed (Fast)",
                tip: "You tend to rush. deeply breathe and slow down to be more articulate."
            });
        }
        if (slowPaceCount >= threshold) {
            weaknesses.push({
                issue: "Speaking Speed (Slow)",
                tip: "Your pace is a bit slow. Try to show more energy and confidence."
            });
        }
        // Fallback or generic voice feedback if specific metrics aren't the trigger but overall score is low
        if (lowVoiceCount >= threshold && highFillerCount < threshold && fastPaceCount < threshold && slowPaceCount < threshold) {
            weaknesses.push({
                issue: "Voice Delivery",
                tip: "Your overall delivery score is low. Focus on clarity, tone, and confidence."
            });
        }

        // Limit to top 3
        res.json(weaknesses.slice(0, 3));

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Interview Details
// @route   GET /api/interview/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        // Verify user owns this interview
        if (interview.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.json(interview);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Interview not found' });
        }
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

// Configure Multer for Audio
const audioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/audio';
        // Ensure directory exists (sync is okay for startup/low volume, or use fs-extra)
        // For simplicity, assuming 'uploads' exists, we might need to create 'audio' subdir manually or via script
        // better: use path.join
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `audio-${Date.now()}-${file.originalname}`);
    }
});

const audioFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
    } else {
        cb(new Error('Only audio files are allowed!'), false);
    }
};

const audioUpload = multer({
    storage: audioStorage,
    fileFilter: audioFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});


// @desc    Submit Answer (Audio)
// @route   POST /api/interview/answer
// @access  Private
router.post('/answer', protect, audioUpload.single('audio'), async (req, res) => {
    try {
        const { questionId, interviewId } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No audio file uploaded' });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Update Question
        question.audioPath = req.file.path;
        question.answeredAt = new Date();

        // Perform Transcription
        const { transcript, confidence, duration } = await transcribeAudio(req.file.path);

        question.transcript = transcript;
        question.confidence = confidence;
        question.audioDuration = duration;

        await question.save();

        res.json({
            message: 'Answer saved',
            audioPath: question.audioPath,
            transcript: question.transcript
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
