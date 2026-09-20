const Goal = require('../models/Goal');
const SubGoal = require('../models/SubGoal');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const { getIsMongoConnected } = require('../db/db');
const { localStore } = require('../services/localStore');

// GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const activities = await Activity.find();
      const goals = await Goal.find();
      const subgoals = await SubGoal.find();
      const tasks = await Task.find();

      res.json({
        activities,
        totalGoals: goals.length,
        completedGoals: goals.filter(g => g.status === 'Completed').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.isCompleted).length,
        subGoalBreakdown: subgoals.map(s => ({
          name: s.title,
          progress: s.progress,
          status: s.status,
          taskCount: tasks.filter(t => t.subGoalId.toString() === s._id.toString()).length,
          completedTaskCount: tasks.filter(t => t.subGoalId.toString() === s._id.toString() && t.isCompleted).length
        }))
      });
    } else {
      res.json({
        activities: localStore.activities,
        totalGoals: localStore.goals.length,
        completedGoals: localStore.goals.filter(g => g.status === 'Completed').length,
        totalTasks: localStore.tasks.length,
        completedTasks: localStore.tasks.filter(t => t.isCompleted).length,
        subGoalBreakdown: localStore.subgoals.map(s => ({
          name: s.title,
          progress: s.progress,
          status: s.status,
          taskCount: localStore.tasks.filter(t => String(t.subGoalId) === String(s._id)).length,
          completedTaskCount: localStore.tasks.filter(t => String(t.subGoalId) === String(s._id) && t.isCompleted).length
        }))
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAnalytics
};
