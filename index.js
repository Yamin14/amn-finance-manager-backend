// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const bookRoutes = require('./routes/books');
const distributionRoutes = require('./routes/distributions');
const authRoutes = require('./routes/auth');

const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://amn-finance-manager.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options('*', cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/students', authMiddleware, studentRoutes);
app.use('/api/books', authMiddleware, bookRoutes);
app.use('/api/distributions', authMiddleware, distributionRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));
