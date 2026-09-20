const express = require('express');
const router = express.Router();
const { toggleTask, deleteTask } = require('../controllers/taskController');

router.patch('/tasks/:id/toggle', toggleTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;
