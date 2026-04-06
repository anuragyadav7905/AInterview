const express = require('express');
const multer = require('multer');
const Interview = require('../models/Interview');
const Question = require('../models/Question');
const CV = require('../models/CV');
const { protect } = require('../middleware/authMiddleware');
const { generateInterviewQuestion, evaluateAnswer, evaluateAndGenerateNext, transcribeWithGemini } = require('../services/geminiService');

const router = express.Router();

// Memory storage multer for audio uploads
const audioUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// @desc    Start new interview
// @route   POST /api/interview/start
// @access  Private
router.post('/start', protect, async (req, res) => {
    const { cvId, persona, role, difficulty } = req.body;

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
            cv: actualCvId,
            role: role || 'Software Engineer',
            difficulty: difficulty || 'Medium',
            style: persona || 'Professional'
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
        const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id }).populate('cv');
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

        const nextQuestionText = await generateInterviewQuestion(cvData, previousQA, questionNumber, totalQuestions, interview.style, interview.role, interview.difficulty);

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

// @desc    Submit answer — evaluates current answer AND generates next question in one request
// @route   POST /api/interview/:id/answer
// @access  Private
router.post('/:id/answer', protect, async (req, res) => {
    try {
        const { answer, isLastQuestion } = req.body;
        const interviewId = req.params.id;

        if (!answer || !answer.trim()) {
            return res.status(400).json({ message: 'Answer is required.' });
        }

        const interview = await Interview.findOne({ _id: interviewId, user: req.user._id }).populate('cv');
        if (!interview) return res.status(404).json({ message: 'Interview not found' });

        const existingQuestions = await Question.find({ interview: interviewId }).sort({ order: 1 });
        const latestQuestion = existingQuestions[existingQuestions.length - 1] || null;

        let evaluation = null;
        let nextQuestion = null;

        if (latestQuestion) {
            const cvContext = interview.cv ? JSON.stringify(interview.cv.structuredData) : null;
            const previousQA = existingQuestions
                .map(q => `Q: ${q.content}\nA: ${q.transcript || '(No answer provided)'}`)
                .join('\n\n');
            const nextQuestionNumber = existingQuestions.length + 1;

            try {
                // Single Gemini call — evaluate answer + generate next question together
                const geminiResult = await evaluateAndGenerateNext({
                    question: latestQuestion.content,
                    answer,
                    cvContext,
                    generateNext: !isLastQuestion,
                    nextQuestionNumber,
                    totalQuestions: 5,
                    previousQA,
                    persona: interview.style,
                    role: interview.role,
                    difficulty: interview.difficulty
                });

                evaluation = geminiResult.evaluation;
                nextQuestion = geminiResult.nextQuestion || null;
            } catch (geminiError) {
                console.error('[answer] Gemini call failed, using fallback:', geminiError.message);
                evaluation = {
                    score: 5,
                    feedback: 'Evaluation temporarily unavailable. Your answer has been recorded.',
                    strength: 'Answer was provided.',
                    improvement: 'Try to be more specific and structured in your response.',
                    modelAnswer: 'N/A'
                };
            }

            // Save evaluation to DB (always — real or fallback)
            try {
                latestQuestion.transcript = answer;
                latestQuestion.score = evaluation.score;
                latestQuestion.feedback = evaluation.feedback;
                latestQuestion.feedbackStrengths = evaluation.strength ? [evaluation.strength] : [];
                latestQuestion.feedbackImprovements = evaluation.improvement ? [evaluation.improvement] : [];
                latestQuestion.answeredAt = new Date();
                latestQuestion.finalScore = evaluation.score;
                await latestQuestion.save();

                const allScored = await Question.find({ interview: interviewId, finalScore: { $exists: true, $ne: null } });
                if (allScored.length > 0) {
                    const sum = allScored.reduce((acc, q) => acc + q.finalScore, 0);
                    await Interview.findByIdAndUpdate(interviewId, {
                        averageScore: Math.round((sum / allScored.length) * 10) / 10
                    });
                }
            } catch (saveError) {
                console.error('[answer] Failed to save score to DB:', saveError.message);
            }

            // Save next question to DB (real or fallback) so flow never breaks
            if (!isLastQuestion) {
                if (!nextQuestion) {
                    const fallbackQuestions = [
                        `Can you describe a challenging project in your ${interview.role} experience and how you overcame the obstacles?`,
                        `How do you approach learning new technologies relevant to ${interview.role}?`,
                        `Tell me about a time you had to collaborate with a difficult team member. How did you handle it?`,
                        `What do you consider your biggest strength as a ${interview.role}, and how have you applied it?`
                    ];
                    nextQuestion = fallbackQuestions[(nextQuestionNumber - 1) % fallbackQuestions.length];
                }
                await Question.create({
                    interview: interviewId,
                    content: nextQuestion,
                    order: nextQuestionNumber
                });
            }
        } else if (!isLastQuestion) {
            // First message ("Yes let's start") — no question to evaluate, just generate Q1
            const nextQuestionNumber = existingQuestions.length + 1;
            const cvData = interview.cv ? (interview.cv.structuredData || interview.cv.parsedText || null) : null;
            try {
                nextQuestion = await generateInterviewQuestion(
                    cvData, '', nextQuestionNumber, 5,
                    interview.style, interview.role, interview.difficulty
                );
            } catch (e) {
                console.error('[answer] Q1 generation failed:', e.message);
                nextQuestion = `Tell me about yourself and your experience as a ${interview.role}.`;
            }
            await Question.create({ interview: interviewId, content: nextQuestion, order: nextQuestionNumber });
        }

        res.json({ evaluation, nextQuestion });

    } catch (error) {
        console.error('[/:id/answer] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Evaluate Answer (kept for backwards compatibility)
// @route   POST /api/interview/evaluate
// @access  Private
router.post('/evaluate', protect, async (req, res) => {
    try {
        const { answer, interviewId } = req.body;
        const interview = await Interview.findById(interviewId).populate('cv');
        if (!interview) return res.status(404).json({ message: 'Interview not found' });

        const latestQuestion = await Question.findOne({ interview: interviewId }).sort({ order: -1 });
        if (!latestQuestion) return res.status(400).json({ message: 'No pending question found to evaluate.' });

        const cvContext = interview.cv ? JSON.stringify(interview.cv.structuredData) : null;
        const evaluation = await evaluateAnswer(latestQuestion.content, answer, cvContext);

        latestQuestion.transcript = answer;
        latestQuestion.score = evaluation.score;
        latestQuestion.feedback = evaluation.feedback;
        latestQuestion.feedbackStrengths = evaluation.strength ? [evaluation.strength] : [];
        latestQuestion.feedbackImprovements = evaluation.improvement ? [evaluation.improvement] : [];
        latestQuestion.answeredAt = new Date();
        latestQuestion.finalScore = evaluation.score;
        await latestQuestion.save();

        const allScored = await Question.find({ interview: interviewId, finalScore: { $exists: true, $ne: null } });
        if (allScored.length > 0) {
            const sum = allScored.reduce((acc, q) => acc + q.finalScore, 0);
            await Interview.findByIdAndUpdate(interviewId, { averageScore: Math.round((sum / allScored.length) * 10) / 10 });
        }

        res.json({ message: 'Evaluation complete', evaluation });
    } catch (error) {
        console.error('[/evaluate] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Interview Summary
// @route   GET /api/interview/:id/summary
// @access  Private
router.get('/:id/summary', protect, async (req, res) => {
    try {
        const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
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
