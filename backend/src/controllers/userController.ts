import { Request, Response } from 'express';
import { getUserProfile } from '../services/userService';

export const getProfile = (_req: Request, res: Response): void => {
  try {
    const user = getUserProfile();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user profile' });
  }
};
