const express = require('express');
const router = express.Router();
const { deleteSubGoal } = require('../controllers/subGoalController');
const { createTask } = require('../controllers/taskController');

router.delete('/subgoals/:id', deleteSubGoal);
router.post('/subgoals/:subGoalId/tasks', createTask);

module.exports = router;
