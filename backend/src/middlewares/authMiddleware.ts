import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

interface DecodedToken {
  oid?: string;
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  tid?: string;
  aud?: string;
  iss?: string;
  exp?: number;
}

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

// JWKS client for Azure AD token validation
const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`,
  cache: true,
  rateLimit: true,
});

/**
 * Get signing key from Azure AD JWKS endpoint
 */
function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

/**
 * Middleware to validate Azure AD JWT tokens
 * Verifies token signature, expiration, issuer, and audience
 */
export async function validateAzureToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.substring(7);

    // Verify and decode token
    jwt.verify(
      token,
      getKey,
      {
        audience: process.env.AZURE_CLIENT_ID,
        issuer: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`,
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) {
          console.error('Token validation error:', err);
          res.status(401).json({ error: 'Invalid or expired token' });
          return;
        }

        // Attach user info to request
        req.user = decoded as DecodedToken;
        next();
      }
    );
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}

/**
 * Optional authentication middleware
 * Validates token if present, but allows request to proceed without authentication
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  // If token is present, validate it
  await validateAzureToken(req, res, next);
}
