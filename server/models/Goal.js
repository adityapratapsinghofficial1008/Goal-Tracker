const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: 'General' },
  targetDate: String,
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'In Progress' },
  overallProgress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', GoalSchema);
