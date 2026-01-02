import { Request, Response } from 'express';
import { getQuickLinks, createQuickLink, deleteQuickLink } from '../services/quickLinkService';

export const getLinks = (_req: Request, res: Response): void => {
  try {
    const links = getQuickLinks();
    res.json({ success: true, data: links });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch quick links' });
  }
};

export const addLink = (req: Request, res: Response): void => {
  try {
    const { name, url } = req.body;
    if (!name || !url) {
      res.status(400).json({ success: false, error: 'Name and URL are required' });
      return;
    }
    const link = createQuickLink(name, url);
    res.status(201).json({ success: true, data: link });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create quick link' });
  }
};

export const removeLink = (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid ID' });
      return;
    }
    const success = deleteQuickLink(id);
    if (!success) {
      res.status(404).json({ success: false, error: 'Quick link not found' });
      return;
    }
    res.json({ success: true, data: { message: 'Quick link deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete quick link' });
  }
};
