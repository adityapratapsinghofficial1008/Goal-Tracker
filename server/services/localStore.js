const fs = require('fs');
const path = require('path');
const Goal = require('../models/Goal');
const SubGoal = require('../models/SubGoal');
const Task = require('../models/Task');
const { getIsMongoConnected } = require('../db/db');

const DB_FILE = path.join(__dirname, '..', 'data_store.json');

function loadLocalStore() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.error('Error reading data_store.json:', e);
    }
  }
  return {
    goals: [
      {
        _id: 'goal_1',
        title: 'Master Modern Web Development Architecture',
        description: 'Complete full-stack mastery including Art Deco UI design system, microservices, and high-performance databases.',
        category: 'Career & Tech',
        targetDate: '2026-12-31',
        status: 'In Progress',
        overallProgress: 45,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'goal_2',
        title: 'Art Deco Luxury Villa Interior Design',
        description: 'Design and procure custom gilded furniture, geometric marble tiling, and brass accent lighting.',
        category: 'Personal & Lifestyle',
        targetDate: '2027-06-30',
        status: 'In Progress',
        overallProgress: 30,
        createdAt: new Date().toISOString()
      }
    ],
    subgoals: [
      {
        _id: 'sub_1',
        goalId: 'goal_1',
        title: 'Build Art Deco Frontend UI System',
        month: '2026-09',
        assignedDate: '2026-09-15',
        targetDate: '2026-09-25',
        status: 'In Progress',
        progress: 70,
        weight: 1
      },
      {
        _id: 'sub_2',
        goalId: 'goal_1',
        title: 'Implement MongoDB Data Persistence Layer',
        month: '2026-09',
        assignedDate: '2026-09-20',
        targetDate: '2026-09-28',
        status: 'In Progress',
        progress: 40,
        weight: 1
      },
      {
        _id: 'sub_3',
        goalId: 'goal_2',
        title: 'Draft Geometric Living Room Layouts',
        month: '2026-10',
        assignedDate: '2026-10-05',
        targetDate: '2026-10-15',
        status: 'Not Started',
        progress: 0,
        weight: 1
      }
    ],
    tasks: [
      {
        _id: 'task_1',
        subGoalId: 'sub_1',
        goalId: 'goal_1',
        title: 'Create Obsidian & Gold CSS design tokens',
        date: '2026-09-14',
        isCompleted: true,
        completedAt: new Date().toISOString()
      },
      {
        _id: 'task_2',
        subGoalId: 'sub_1',
        goalId: 'goal_1',
        title: 'Build metallic progress bar & Sunburst charts',
        date: '2026-09-15',
        isCompleted: false
      },
      {
        _id: 'task_3',
        subGoalId: 'sub_2',
        goalId: 'goal_1',
        title: 'Define Mongoose schemas for Goal & SubGoal',
        date: '2026-09-14',
        isCompleted: true,
        completedAt: new Date().toISOString()
      },
      {
        _id: 'task_4',
        subGoalId: 'sub_2',
        goalId: 'goal_1',
        title: 'Connect Express server to Mongo DB cluster',
        date: '2026-09-16',
        isCompleted: false
      }
    ],
    activities: [
      { date: '2026-09-10', count: 2 },
      { date: '2026-09-12', count: 4 },
      { date: '2026-09-14', count: 5 }
    ]
  };
}

function saveLocalStore(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save to local store file:', e);
  }
}

let localStore = loadLocalStore();

async function recalculateGoalProgress(goalId) {
  if (getIsMongoConnected()) {
    try {
      const subgoals = await SubGoal.find({ goalId });
      if (subgoals.length === 0) return;
      const tasks = await Task.find({ goalId });

      let totalTasks = tasks.length;
      let completedTasks = tasks.filter(t => t.isCompleted).length;

      let progress = 0;
      if (totalTasks > 0) {
        progress = Math.round((completedTasks / totalTasks) * 100);
      } else {
        const completedSubgoals = subgoals.filter(s => s.status === 'Completed').length;
        progress = Math.round((completedSubgoals / subgoals.length) * 100);
      }

      const status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started';
      await Goal.findByIdAndUpdate(goalId, { overallProgress: progress, status });

      for (const sg of subgoals) {
        const sgTasks = tasks.filter(t => t.subGoalId.toString() === sg._id.toString());
        if (sgTasks.length > 0) {
          const sgDone = sgTasks.filter(t => t.isCompleted).length;
          const sgProg = Math.round((sgDone / sgTasks.length) * 100);
          const sgStatus = sgProg === 100 ? 'Completed' : sgProg > 0 ? 'In Progress' : 'Not Started';
          await SubGoal.findByIdAndUpdate(sg._id, { progress: sgProg, status: sgStatus });
        }
      }
    } catch (e) {
      console.error('Error recalculating progress in Mongo:', e);
    }
  } else {
    const subgoals = localStore.subgoals.filter(s => String(s.goalId) === String(goalId));
    const tasks = localStore.tasks.filter(t => String(t.goalId) === String(goalId));

    let progress = 0;
    if (tasks.length > 0) {
      const completed = tasks.filter(t => t.isCompleted).length;
      progress = Math.round((completed / tasks.length) * 100);
    } else if (subgoals.length > 0) {
      const completedSg = subgoals.filter(s => s.status === 'Completed').length;
      progress = Math.round((completedSg / subgoals.length) * 100);
    }

    const gIndex = localStore.goals.findIndex(g => String(g._id) === String(goalId));
    if (gIndex !== -1) {
      localStore.goals[gIndex].overallProgress = progress;
      localStore.goals[gIndex].status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started';
    }

    subgoals.forEach(sg => {
      const sgTasks = tasks.filter(t => String(t.subGoalId) === String(sg._id));
      if (sgTasks.length > 0) {
        const sgDone = sgTasks.filter(t => t.isCompleted).length;
        const sgProg = Math.round((sgDone / sgTasks.length) * 100);
        sg.progress = sgProg;
        sg.status = sgProg === 100 ? 'Completed' : sgProg > 0 ? 'In Progress' : 'Not Started';
      }
    });

    saveLocalStore(localStore);
  }
}

module.exports = {
  localStore,
  saveLocalStore,
  recalculateGoalProgress
};
