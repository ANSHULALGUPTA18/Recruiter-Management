import { Router } from 'express';
import { getTasks, addTask, patchTask, removeTask } from '../controllers/taskController';

const router = Router();

router.get('/', getTasks);
router.post('/', addTask);
router.patch('/:id', patchTask);
router.delete('/:id', removeTask);

export default router;
