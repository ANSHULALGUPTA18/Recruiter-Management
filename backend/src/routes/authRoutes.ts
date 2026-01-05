import { Router } from 'express';
import { validateAzureToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * GET /api/auth/validate
 * Validates the Azure AD token and returns user info
 */
router.get('/validate', validateAzureToken, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      id: req.user?.oid || req.user?.sub,
      email: req.user?.email || req.user?.preferred_username,
      name: req.user?.name,
      tenantId: req.user?.tid,
    },
  });
});

/**
 * GET /api/auth/me
 * Returns current authenticated user information
 */
router.get('/me', validateAzureToken, (req, res) => {
  res.json({
    id: req.user?.oid || req.user?.sub,
    email: req.user?.email || req.user?.preferred_username,
    name: req.user?.name,
    tenantId: req.user?.tid,
  });
});

export default router;
