import { QuickLink } from '../models/types';

let quickLinks: QuickLink[] = [
  { id: 1, name: 'Legal Compliance', route: 'https://frontend.reddesert-f6724e64.centralus.azurecontainerapps.io', icon: 'FileText', isExternal: true },
  { id: 2, name: 'Resume Formatter', route: 'https://resume-formatter.reddesert-f6724e64.centralus.azurecontainerapps.io/', icon: 'FileCheck', isExternal: true },
  { id: 3, name: 'Resume Formatter', route: 'https://resume-formatter.reddesert-f6724e64.centralus.azurecontainerapps.io/', icon: 'FileCheck', isExternal: true },
  { id: 4, name: 'Resume Formatter', route: 'https://resume-formatter.reddesert-f6724e64.centralus.azurecontainerapps.io/', icon: 'FileCheck', isExternal: true }
];

let nextId = 5;

export const getQuickLinks = (): QuickLink[] => {
  return quickLinks;
};

export const createQuickLink = (name: string, route: string): QuickLink => {
  const newLink: QuickLink = {
    id: nextId++,
    name,
    route,
    icon: 'FileText',
    isExternal: true
  };
  quickLinks.push(newLink);
  return newLink;
};

export const deleteQuickLink = (id: number): boolean => {
  const initialLength = quickLinks.length;
  quickLinks = quickLinks.filter(link => link.id !== id);
  return quickLinks.length < initialLength;
};
