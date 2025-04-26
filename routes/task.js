const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create Task
router.post('/create', async (req, res) => {
    try {
        const { title, description, status, projectId } = req.body;

        const newTask = new Task({
            title,
            description,
            status,
            project: projectId
        });

        await newTask.save();
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating task');
    }
});

// Show Edit Task Form
router.get('/edit/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.render('editTask', { task });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading edit form');
    }
});

// Update Task
router.post('/update/:id', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task.findById(req.params.id);

        task.title = title;
        task.description = description;
        task.status = status;

        // If status is "Completed", set completedAt date
        if (status === "Completed" && !task.completedAt) {
            task.completedAt = new Date();
        }

        await task.save();
        res.redirect(`/project/${task.project}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating task');
    }
});

// Delete Task
router.get('/delete/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const projectId = task.project;
        await Task.findByIdAndDelete(req.params.id);
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting task');
    }
});

