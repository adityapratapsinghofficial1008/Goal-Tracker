const SubGoal = require('../models/SubGoal');
const Task = require('../models/Task');
const { getIsMongoConnected } = require('../db/db');
const { localStore, saveLocalStore, recalculateGoalProgress } = require('../services/localStore');

// POST /api/goals/:goalId/subgoals
const createSubGoal = async (req, res) => {
  const { goalId } = req.params;
  const { title, month, assignedDate, targetDate, weight } = req.body;

  if (!title) return res.status(400).json({ error: 'Subgoal title is required' });

  try {
    if (getIsMongoConnected()) {
      const newSubGoal = await SubGoal.create({
        goalId,
        title,
        month: month || (assignedDate ? assignedDate.substring(0, 7) : new Date().toISOString().substring(0, 7)),
        assignedDate: assignedDate || new Date().toISOString().substring(0, 10),
        targetDate: targetDate || '',
        weight: weight || 1
      });
      await recalculateGoalProgress(goalId);
      return res.status(201).json({ ...newSubGoal.toObject(), tasks: [] });
    } else {
      const newSubGoal = {
        _id: 'sub_' + Date.now(),
        goalId,
        title,
        month: month || (assignedDate ? assignedDate.substring(0, 7) : new Date().toISOString().substring(0, 7)),
        assignedDate: assignedDate || new Date().toISOString().substring(0, 10),
        targetDate: targetDate || '',
        status: 'Not Started',
        progress: 0,
        weight: weight || 1,
        tasks: []
      };
      localStore.subgoals.push(newSubGoal);
      recalculateGoalProgress(goalId);
      saveLocalStore(localStore);
      return res.status(201).json(newSubGoal);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/subgoals/:id
const deleteSubGoal = async (req, res) => {
  const { id } = req.params;
  try {
    if (getIsMongoConnected()) {
      const subGoal = await SubGoal.findByIdAndDelete(id);
      if (subGoal) {
        await Task.deleteMany({ subGoalId: id });
        await recalculateGoalProgress(subGoal.goalId);
      }
    } else {
      const subGoal = localStore.subgoals.find(s => String(s._id) === String(id));
      localStore.subgoals = localStore.subgoals.filter(s => String(s._id) !== String(id));
      localStore.tasks = localStore.tasks.filter(t => String(t.subGoalId) !== String(id));
      if (subGoal) recalculateGoalProgress(subGoal.goalId);
      saveLocalStore(localStore);
    }
    res.json({ message: 'Sub-goal deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createSubGoal,
  deleteSubGoal
};
