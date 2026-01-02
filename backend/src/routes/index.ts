import { Router } from 'express';
import userRoutes from './userRoutes';
import taskRoutes from './taskRoutes';
import jobRoutes from './jobRoutes';
import quickLinkRoutes from './quickLinkRoutes';

const router = Router();

router.use('/user', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/jobs', jobRoutes);
router.use('/quick-links', quickLinkRoutes);

export default router;
