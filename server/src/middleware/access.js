// Access middleware: enforces admin-only and privileged permissions.
// It checks whether the current user is allowed to continue.
// Use this file to understand role-based route protection.
import { AppError } from '../shared/AppError.js';
import { hasAdminAccess, hasManagerAccess, isManagerEmail, isAdminEmail } from '../shared/access.js';

export const requireAdmin = (req, res, next) => {
  if (isAdminEmail(req.authUser?.email)) {
    return next();
  }

  return next(new AppError('Forbidden', 403));
};

export const requirePrivileged = (req, res, next) => {
  const email = req.authUser?.email;

  if (isAdminEmail(email) || isManagerEmail(email)) {
    return next();
  }

  Promise.all([hasAdminAccess(req.authUser?.sub), hasManagerAccess(req.authUser?.sub)])
    .then((allowed) => {
      if (allowed.some(Boolean)) {
        return next();
      }

      return next(new AppError('Forbidden', 403));
    })
    .catch(() => next(new AppError('Forbidden', 403)));
};
