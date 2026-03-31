const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

dotenv.config();

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

if (!process.env.GEMINI_API_KEY) {
  console.warn('\n==== WARNING ====');
  console.warn('GEMINI_API_KEY is not set in .env.');
  console.warn('AI Interview functionality will fail.');
  console.warn('=================\n');
}

const passport = require('passport');
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5001;

const authRoutes = require('./routes/auth');

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(passport.initialize());

// Rate limiting on auth routes only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/auth', authLimiter);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ainterview')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload-cv', require('./routes/upload'));
app.use('/api/interview', require('./routes/interview'));

// Make uploads folder static
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
