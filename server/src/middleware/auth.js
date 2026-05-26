// Auth middleware: validates bearer tokens and attaches the decoded user.
// It blocks requests without a valid JWT.
// Use this file to understand request authentication.
import { AppError } from "../shared/AppError.js";
import { verifyToken } from "../features/auth.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const queryToken = typeof req.query?.token === "string" ? req.query.token : null;
  const token = headerToken || queryToken;

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    req.authUser = verifyToken(token);
    return next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
