const express = require('express');
const router = express.Router();

const goalRoutes = require('./goalRoutes');
const subGoalRoutes = require('./subGoalRoutes');
const taskRoutes = require('./taskRoutes');
const analyticsRoutes = require('./analyticsRoutes');

router.use('/', goalRoutes);
router.use('/', subGoalRoutes);
router.use('/', taskRoutes);
router.use('/', analyticsRoutes);

module.exports = router;
