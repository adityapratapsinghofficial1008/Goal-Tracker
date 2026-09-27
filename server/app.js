const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

const { connectDB } = require('./db/db');

// Global Middleware
app.use(cors());
app.use(express.json());

// Dynamic MongoDB connection middleware for custom client URIs
app.use(async (req, res, next) => {
  const customUri = req.headers['x-mongo-uri'];
  if (customUri) {
    await connectDB(customUri);
  }
  next();
});

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
