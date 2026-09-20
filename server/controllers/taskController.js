const Task = require('../models/Task');
const SubGoal = require('../models/SubGoal');
const Activity = require('../models/Activity');
const { getIsMongoConnected } = require('../db/db');
const { localStore, saveLocalStore, recalculateGoalProgress } = require('../services/localStore');

// POST /api/subgoals/:subGoalId/tasks
const createTask = async (req, res) => {
  const { subGoalId } = req.params;
  const { title, date, goalId } = req.body;

  if (!title) return res.status(400).json({ error: 'Task title is required' });

  const taskDate = date || new Date().toISOString().substring(0, 10);

  try {
    if (getIsMongoConnected()) {
      let targetGoalId = goalId;
      if (!targetGoalId) {
        const sg = await SubGoal.findById(subGoalId);
        targetGoalId = sg ? sg.goalId : null;
      }
      const newTask = await Task.create({
        subGoalId,
        goalId: targetGoalId,
        title,
        date: taskDate,
        isCompleted: false
      });

      await recalculateGoalProgress(targetGoalId);
      return res.status(201).json(newTask);
    } else {
      let targetGoalId = goalId;
      if (!targetGoalId) {
        const sg = localStore.subgoals.find(s => String(s._id) === String(subGoalId));
        targetGoalId = sg ? sg.goalId : '';
      }
      const newTask = {
        _id: 'task_' + Date.now(),
        subGoalId,
        goalId: targetGoalId,
        title,
        date: taskDate,
        isCompleted: false
      };
      localStore.tasks.push(newTask);
      recalculateGoalProgress(targetGoalId);
      saveLocalStore(localStore);
      return res.status(201).json(newTask);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/tasks/:id/toggle
const toggleTask = async (req, res) => {
  const { id } = req.params;

  try {
    if (getIsMongoConnected()) {
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ error: 'Task not found' });

      task.isCompleted = !task.isCompleted;
      task.completedAt = task.isCompleted ? new Date() : null;
      await task.save();

      if (task.isCompleted) {
        const todayStr = task.date || new Date().toISOString().substring(0, 10);
        await Activity.findOneAndUpdate(
          { date: todayStr },
          { $inc: { count: 1 }, goalId: task.goalId },
          { upsert: true, new: true }
        );
      }

      await recalculateGoalProgress(task.goalId);
      return res.json(task);
    } else {
      const taskIndex = localStore.tasks.findIndex(t => String(t._id) === String(id));
      if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

      const task = localStore.tasks[taskIndex];
      task.isCompleted = !task.isCompleted;
      task.completedAt = task.isCompleted ? new Date().toISOString() : null;

      if (task.isCompleted) {
        const todayStr = task.date || new Date().toISOString().substring(0, 10);
        const actIndex = localStore.activities.findIndex(a => a.date === todayStr);
        if (actIndex !== -1) {
          localStore.activities[actIndex].count += 1;
        } else {
          localStore.activities.push({ date: todayStr, count: 1, goalId: task.goalId });
        }
      }

      recalculateGoalProgress(task.goalId);
      saveLocalStore(localStore);
      return res.json(task);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    if (getIsMongoConnected()) {
      const task = await Task.findByIdAndDelete(id);
      if (task) await recalculateGoalProgress(task.goalId);
    } else {
      const task = localStore.tasks.find(t => String(t._id) === String(id));
      localStore.tasks = localStore.tasks.filter(t => String(t._id) !== String(id));
      if (task) recalculateGoalProgress(task.goalId);
      saveLocalStore(localStore);
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTask,
  toggleTask,
  deleteTask
};
