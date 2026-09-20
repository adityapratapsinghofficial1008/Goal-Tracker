const mongoose = require('mongoose');

const SubGoalSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  title: { type: String, required: true },
  month: String, // e.g. "2026-09"
  assignedDate: String, // e.g. "2026-09-15"
  targetDate: String,
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  progress: { type: Number, default: 0 },
  weight: { type: Number, default: 1 }
});

module.exports = mongoose.model('SubGoal', SubGoalSchema);
