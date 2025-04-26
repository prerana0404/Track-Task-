const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');

// Create Project
router.post('/create', async (req, res) => {
  const count = await Project.countDocuments({ user: req.session.userId });
  if (count >= 4) return res.send('Max 4 projects allowed.');

  await Project.create({ title: req.body.title, user: req.session.userId });
  res.redirect('/dashboard');
});

// View Tasks
router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  const tasks = await Task.find({ project: project._id });
  res.render('tasks', { project, tasks });
});

// Create Task
router.post('/:id/task', async (req, res) => {
  await Task.create({ 
    project: req.params.id,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status
  });
  res.redirect(`/projects/${req.params.id}`);
});

// Update Task
router.post('/task/:taskId/update', async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.taskId);
  
  task.status = status;
  if (status === 'Completed') {
    task.completedAt = new Date();
  }
  await task.save();
  res.redirect(`/projects/${task.project}`);
});

// Delete Task
router.post('/task/:taskId/delete', async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  await Task.findByIdAndDelete(req.params.taskId);
  res.redirect(`/projects/${task.project}`);
});

module.exports = router;
