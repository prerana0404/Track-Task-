const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');

// Dashboard
router.get('/', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const user = await User.findById(req.session.userId);
  const projects = await Project.find({ user: user._id });
  res.render('dashboard', { user, projects });
});

module.exports = router;
