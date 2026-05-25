// Access middleware: enforces CEO-only and privileged permissions.
// It checks whether the current user is allowed to continue.
// Use this file to understand role-based route protection.
import { AppError } from '../shared/AppError.js';
import { isCEOEmail, isPrivilegedEmail } from '../shared/access.js';

export const requireAdmin = (req, res, next) => {
  if (isCEOEmail(req.authUser?.email)) {
    return next();
  }

  return next(new AppError('Forbidden', 403));
};

export const requirePrivileged = (req, res, next) => {
  if (isPrivilegedEmail(req.authUser?.email)) {
    return next();
  }

  return next(new AppError('Forbidden', 403));
};
