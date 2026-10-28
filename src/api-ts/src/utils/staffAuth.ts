import { timingSafeEqual } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

/**
 * Server-side staff authorization. Requires an `Authorization: Bearer <token>` header matching
 * the STAFF_API_TOKEN environment variable. If the variable is unset, access is denied.
 */
export function requireStaff(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.STAFF_API_TOKEN;
  const header = req.headers.authorization ?? '';
  const prefix = 'Bearer ';
  const supplied =
    header.length > prefix.length && header.slice(0, prefix.length).toLowerCase() === prefix.toLowerCase()
      ? header.slice(prefix.length).trim()
      : '';

  if (!expected || !supplied) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Staff authorization required' } });
    return;
  }

  const provided = Buffer.from(supplied);
  const expectedBuf = Buffer.from(expected);
  if (provided.length !== expectedBuf.length || !timingSafeEqual(provided, expectedBuf)) {
    res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Staff access denied' } });
    return;
  }

  next();
}
