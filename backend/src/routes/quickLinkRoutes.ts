import { Router } from 'express';
import { getLinks, addLink, removeLink } from '../controllers/quickLinkController';

const router = Router();

router.get('/', getLinks);
router.post('/', addLink);
router.delete('/:id', removeLink);

export default router;
