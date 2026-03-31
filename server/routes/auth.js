const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
require('../config/passport');

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Guard: Google-only accounts have no password
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (await user.matchPassword(password)) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || null,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || null,
                preferences: user.preferences
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Save user preferences
// @route   PUT /api/auth/preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
    const { notifications, persona } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { preferences: { notifications, persona } },
            { new: true }
        ).select('-password');
        res.json({ preferences: user.preferences });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Redirect to Google OAuth
// @route   GET /api/auth/google
// @access  Public
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user) => {
        const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
        if (err) {
            console.error('Google OAuth error:', err);
            return res.redirect(`${clientURL}/login?error=google_failed`);
        }
        if (!user) {
            return res.redirect(`${clientURL}/login?error=google_failed`);
        }
        res.redirect(`${clientURL}/auth/google/success?token=${user.token}`);
    })(req, res, next);
});

module.exports = router;
