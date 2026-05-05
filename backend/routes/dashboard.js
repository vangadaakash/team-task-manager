const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    let stats = {
      totalTasks: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      doneTasks: 0,
      overdueTasks: 0
    };

    let tasks;

    if (req.user.role === 'ADMIN') {
      // Admin sees stats for all their projects' tasks
      const projects = await prisma.project.findMany({
        where: { ownerId: req.user.id },
        select: { id: true }
      });
      const projectIds = projects.map(p => p.id);
      tasks = await prisma.task.findMany({
        where: { projectId: { in: projectIds } }
      });
    } else {
      // Member sees stats for their assigned tasks
      tasks = await prisma.task.findMany({
        where: { assigneeId: req.user.id }
      });
    }

    tasks.forEach(task => {
      stats.totalTasks++;
      if (task.status === 'TODO') stats.todoTasks++;
      else if (task.status === 'IN_PROGRESS') stats.inProgressTasks++;
      else if (task.status === 'DONE') stats.doneTasks++;

      if (task.dueDate && new Date(task.dueDate) < today && task.status !== 'DONE') {
        stats.overdueTasks++;
      }
    });

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
