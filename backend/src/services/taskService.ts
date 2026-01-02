import { v4 as uuidv4 } from 'uuid';
import { Task } from '../models/types';

let tasks: Task[] = [
  { id: uuidv4(), title: 'Task 1', completed: false, createdAt: new Date() },
  { id: uuidv4(), title: 'Task 2', completed: false, createdAt: new Date() },
  { id: uuidv4(), title: 'Task 3', completed: false, createdAt: new Date() },
  { id: uuidv4(), title: 'Task 4', completed: false, createdAt: new Date() },
  { id: uuidv4(), title: 'Task 5', completed: false, createdAt: new Date() },
  { id: uuidv4(), title: 'Task 6', completed: false, createdAt: new Date() }
];

export const getAllTasks = (): Task[] => {
  return tasks;
};

export const createTask = (title: string): Task => {
  const newTask: Task = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date()
  };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Task>): Task | null => {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return null;

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  return tasks[taskIndex];
};

export const deleteTask = (id: string): boolean => {
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  return tasks.length < initialLength;
};
