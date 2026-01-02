import { Request, Response } from 'express';
import { getJobSummary } from '../services/jobService';

export const getSummary = (_req: Request, res: Response): void => {
  try {
    const summary = getJobSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch job summary' });
  }
};
