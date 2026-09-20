const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
