const Goal = require('../models/Goal');
const SubGoal = require('../models/SubGoal');
const Task = require('../models/Task');
const { getIsMongoConnected } = require('../db/db');
const { localStore, saveLocalStore, recalculateGoalProgress } = require('../services/localStore');

// GET /api/goals
const getGoals = async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const goals = await Goal.find().sort({ createdAt: -1 });
      const subgoals = await SubGoal.find();
      const tasks = await Task.find();

      const fullData = goals.map(goal => ({
        ...goal.toObject(),
        subgoals: subgoals.filter(sg => sg.goalId.toString() === goal._id.toString()).map(sg => ({
          ...sg.toObject(),
          tasks: tasks.filter(t => t.subGoalId.toString() === sg._id.toString())
        }))
      }));

      return res.json({ db: 'MongoDB', goals: fullData });
    } else {
      const fullData = localStore.goals.map(goal => ({
        ...goal,
        subgoals: localStore.subgoals.filter(sg => String(sg.goalId) === String(goal._id)).map(sg => ({
          ...sg,
          tasks: localStore.tasks.filter(t => String(t.subGoalId) === String(sg._id))
        }))
      }));
      return res.json({ db: 'LocalStore', goals: fullData });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/goals
const createGoal = async (req, res) => {
  const { title, description, category, targetDate } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    if (getIsMongoConnected()) {
      const newGoal = await Goal.create({ title, description, category, targetDate });
      return res.status(201).json({ ...newGoal.toObject(), subgoals: [] });
    } else {
      const newGoal = {
        _id: 'goal_' + Date.now(),
        title,
        description: description || '',
        category: category || 'General',
        targetDate: targetDate || '',
        status: 'Not Started',
        overallProgress: 0,
        createdAt: new Date().toISOString(),
        subgoals: []
      };
      localStore.goals.unshift(newGoal);
      saveLocalStore(localStore);
      return res.status(201).json(newGoal);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  const { id } = req.params;
  try {
    if (getIsMongoConnected()) {
      await Goal.findByIdAndDelete(id);
      await SubGoal.deleteMany({ goalId: id });
      await Task.deleteMany({ goalId: id });
    } else {
      localStore.goals = localStore.goals.filter(g => String(g._id) !== String(id));
      localStore.subgoals = localStore.subgoals.filter(sg => String(sg.goalId) !== String(id));
      localStore.tasks = localStore.tasks.filter(t => String(t.goalId) !== String(id));
      saveLocalStore(localStore);
    }
    res.json({ message: 'Goal and associated data deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  deleteGoal
};
