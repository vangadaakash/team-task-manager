const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all users for assignment dropdown (Admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create task (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, description, dueDate, projectId, assigneeId } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: Number(projectId),
        assigneeId: assigneeId ? Number(assigneeId) : null
      }
    });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update task
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, status, dueDate, assigneeId } = req.body;
  try {
    const task = await prisma.task.findUnique({ where: { id: Number(req.params.id) } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Members can only update status of their own tasks
    if (req.user.role === 'MEMBER' && task.assigneeId !== req.user.id) {
       return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const dataToUpdate = {};
    if (status) dataToUpdate.status = status;

    if (req.user.role === 'ADMIN') {
      if (title) dataToUpdate.title = title;
      if (description) dataToUpdate.description = description;
      if (dueDate !== undefined) dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;
      if (assigneeId !== undefined) dataToUpdate.assigneeId = assigneeId ? Number(assigneeId) : null;
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: dataToUpdate
    });
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete task (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
