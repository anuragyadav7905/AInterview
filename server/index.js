const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.warn("\\n==== WARNING ====");
  console.warn("GEMINI_API_KEY is not set in .env.");
  console.warn("AI Interview functionality will fail.");
  console.warn("=================\\n");
}

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');

// Middleware
app.use(express.json());
app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
