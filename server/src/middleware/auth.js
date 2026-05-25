import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../services/authService.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

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
