const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  subGoalId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubGoal', required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  title: { type: String, required: true },
  date: { type: String, required: true }, // e.g. "2026-09-14"
  isCompleted: { type: Boolean, default: false },
  completedAt: Date
});

module.exports = mongoose.model('Task', TaskSchema);
