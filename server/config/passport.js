const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Required by passport even when session: false
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const googleEmail = profile.emails?.[0]?.value;
        if (!googleEmail) {
            return done(new Error('No email returned from Google'), null);
        }

        // 1. Find by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // 2. Email already exists → link Google to existing account
            user = await User.findOne({ email: googleEmail });
            if (user) {
                user.googleId = profile.id;
                user.avatar = user.avatar || profile.photos?.[0]?.value;
                await user.save();
            } else {
                // 3. Brand new user — generate a unique username
                const baseUsername = profile.displayName.replace(/\s+/g, '').toLowerCase() || 'user';
                let username = baseUsername;
                let count = 1;
                while (await User.findOne({ username })) {
                    username = `${baseUsername}${count++}`;
                }
                user = await User.create({
                    googleId: profile.id,
                    username,
                    email: googleEmail,
                    avatar: profile.photos?.[0]?.value
                });
            }
        }

        // Convert Mongoose doc → plain object so non-schema props survive passport internals
        const userObj = user.toObject();
        userObj.token = generateToken(user._id);
        return done(null, userObj);
    } catch (err) {
        console.error('Google strategy error:', err);
        return done(err, null);
    }
}));

module.exports = passport;
