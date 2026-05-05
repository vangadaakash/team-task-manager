const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all projects for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'ADMIN') {
      // Admins see projects they own
      projects = await prisma.project.findMany({
        where: { ownerId: req.user.id },
        include: { tasks: true }
      });
    } else {
      // Members see projects where they have assigned tasks
      const tasks = await prisma.task.findMany({
        where: { assigneeId: req.user.id },
        select: { projectId: true }
      });
      const projectIds = tasks.map(t => t.projectId);
      projects = await prisma.project.findMany({
        where: { id: { in: projectIds } },
        include: { tasks: { where: { assigneeId: req.user.id } } }
      });
    }
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get single project
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(req.params.id) },
      include: { tasks: { include: { assignee: { select: { id: true, name: true, email: true } } } } }
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create project (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.user.id
      }
    });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
