import { Router } from 'express';
import { getSummary } from '../controllers/jobController';

const router = Router();

router.get('/summary', getSummary);

export default router;
