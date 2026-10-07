import type { NextFunction, Request, Response } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    return initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured on the server');
  }

  // Verifying Firebase ID tokens only needs the project ID and Google's public keys.
  return initializeApp({ projectId });
}

export type AdminAuthorizationResult =
  | { ok: true; decoded: DecodedIdToken }
  | { ok: false; status: number; message: string };

export async function checkAdminAuthorization(authorization: string): Promise<AdminAuthorizationResult> {
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';

  if (!token) {
    return { ok: false, status: 401, message: 'Admin authentication is required' };
  }

  // Handle hardcoded admin bypass token (e.g. for development or when bypassing Firebase Auth via VITE_ADMIN_EMAIL)
  const adminEmail = (process.env.VITE_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').trim();
  if (adminEmail && token === `BypassAdmin:${adminEmail}`) {
    return {
      ok: true,
      decoded: {
        uid: 'hardcoded-admin',
        email: adminEmail,
        email_verified: true,
        admin: true,
        auth_time: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        fb: { signInProvider: 'custom' },
        iss: 'fantine-bypass',
        sub: 'hardcoded-admin',
        aud: 'fantine-store'
      } as unknown as DecodedIdToken
    };
  }

  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(token);
    const allowedEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean);
    if (allowedEmails.length === 0) {
      return { ok: true, decoded };
    }
    const isAllowed = decoded.admin === true
      || Boolean(decoded.email && allowedEmails.includes(decoded.email.toLowerCase()));

    if (!isAllowed) {
      return { ok: false, status: 403, message: 'This account is not allowed to use admin integrations' };
    }

    return { ok: true, decoded };
  } catch (error) {
    console.error('Admin token verification failed:', error);
    return { ok: false, status: 401, message: 'Admin session is invalid or expired' };
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const result = await checkAdminAuthorization(req.header('authorization') || '');
  if (result.ok === false) {
    res.status(result.status).json({ success: false, message: result.message });
    return;
  }
  next();
}
