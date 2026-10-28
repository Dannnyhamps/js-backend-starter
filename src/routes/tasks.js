import { Router } from 'express';
import { randomUUID } from 'node:crypto';

const router = Router();

// Demo-only in-memory storage. Replace with a database for persistent data.
const tasks = new Map();

function validateTitle(title) {
  return typeof title === 'string' && title.trim().length > 0 && title.trim().length <= 120;
}

router.get('/', (_req, res) => {
  res.json({ data: [...tasks.values()] });
});

router.get('/:id', (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  return res.json({ data: task });
});

router.post('/', (req, res) => {
  const { title, description = '' } = req.body ?? {};
  if (!validateTitle(title)) {
    return res.status(400).json({ error: 'title is required and must be 1–120 characters' });
  }
  if (typeof description !== 'string' || description.length > 2000) {
    return res.status(400).json({ error: 'description must be a string of at most 2000 characters' });
  }

  const now = new Date().toISOString();
  const task = {
    id: randomUUID(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now
  };
  tasks.set(task.id, task);
  return res.status(201).json({ data: task });
});

router.patch('/:id', (req, res) => {
  const existing = tasks.get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  const updates = req.body ?? {};
  const allowed = ['title', 'description', 'completed'];
  if (Object.keys(updates).some((key) => !allowed.includes(key))) {
    return res.status(400).json({ error: 'Only title, description, and completed can be updated' });
  }

  const next = { ...existing };
  if ('title' in updates) {
    if (!validateTitle(updates.title)) {
      return res.status(400).json({ error: 'title must be 1–120 characters' });
    }
    next.title = updates.title.trim();
  }
  if ('description' in updates) {
    if (typeof updates.description !== 'string' || updates.description.length > 2000) {
      return res.status(400).json({ error: 'description must be a string of at most 2000 characters' });
    }
    next.description = updates.description.trim();
  }
  if ('completed' in updates) {
    if (typeof updates.completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be a boolean' });
    }
    next.completed = updates.completed;
  }

  next.updatedAt = new Date().toISOString();
  tasks.set(next.id, next);
  return res.json({ data: next });
});

router.delete('/:id', (req, res) => {
  if (!tasks.has(req.params.id)) return res.status(404).json({ error: 'Task not found' });
  tasks.delete(req.params.id);
  return res.status(204).end();
});

export default router;
