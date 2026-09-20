const express = require('express');
const router = express.Router();
const { getGoals, createGoal, deleteGoal } = require('../controllers/goalController');
const { createSubGoal } = require('../controllers/subGoalController');

router.get('/goals', getGoals);
router.post('/goals', createGoal);
router.delete('/goals/:id', deleteGoal);
router.post('/goals/:goalId/subgoals', createSubGoal);

module.exports = router;
