import { Request, Response } from 'express';
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/taskService';

export const getTasks = (_req: Request, res: Response): void => {
  try {
    const tasks = getAllTasks();
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
  }
};

export const addTask = (req: Request, res: Response): void => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ success: false, error: 'Title is required' });
      return;
    }
    const task = createTask(title);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create task' });
  }
};

export const patchTask = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = updateTask(id, updates);
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
};

export const removeTask = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const success = deleteTask(id);
    if (!success) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }
    res.json({ success: true, data: { message: 'Task deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete task' });
  }
};
