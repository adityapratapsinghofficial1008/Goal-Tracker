const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  date: { type: String, required: true }, // "YYYY-MM-DD"
  count: { type: Number, default: 1 },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }
});

module.exports = mongoose.model('Activity', ActivitySchema);
