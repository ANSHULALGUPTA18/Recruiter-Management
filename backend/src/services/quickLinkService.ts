import fs from 'fs';
import path from 'path';
import { QuickLink } from '../models/types';

interface QuickLinkData {
  nextId: number;
  quickLinks: QuickLink[];
}

const DATA_FILE = path.join(__dirname, '../data/quickLinks.json');

const readData = (): QuickLinkData => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {
      nextId: 1,
      quickLinks: []
    };
  }
};

const writeData = (data: QuickLinkData): void => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

export const getQuickLinks = (): QuickLink[] => {
  const data = readData();
  return data.quickLinks;
};

export const createQuickLink = (name: string, route: string): QuickLink => {
  const data = readData();
  const newLink: QuickLink = {
    id: data.nextId,
    name,
    route,
    icon: 'FileText',
    isExternal: true
  };
  data.quickLinks.push(newLink);
  data.nextId++;
  writeData(data);
  return newLink;
};

export const deleteQuickLink = (id: number): boolean => {
  const data = readData();
  const initialLength = data.quickLinks.length;
  data.quickLinks = data.quickLinks.filter(link => link.id !== id);
  if (data.quickLinks.length < initialLength) {
    writeData(data);
    return true;
  }
  return false;
};
