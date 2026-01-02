import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../models/types';

interface TaskData {
  tasks: Task[];
}

const DATA_FILE = path.join(__dirname, '../data/tasks.json');

const readData = (): TaskData => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { tasks: [] };
  }
};

const writeData = (data: TaskData): void => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

export const getAllTasks = (): Task[] => {
  const data = readData();
  return data.tasks;
};

export const createTask = (title: string): Task => {
  const data = readData();
  const newTask: Task = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date()
  };
  data.tasks.push(newTask);
  writeData(data);
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Task>): Task | null => {
  const data = readData();
  const taskIndex = data.tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return null;

  data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates };
  writeData(data);
  return data.tasks[taskIndex];
};

export const deleteTask = (id: string): boolean => {
  const data = readData();
  const initialLength = data.tasks.length;
  data.tasks = data.tasks.filter(t => t.id !== id);
  if (data.tasks.length < initialLength) {
    writeData(data);
    return true;
  }
  return false;
};
