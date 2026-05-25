// Auth feature: handles login, registration, token creation, and auth routes.
// Auth feature: handles login, registration, token creation, and auth routes.
// It keeps the authentication logic and endpoints together.
// Use this file to understand user sign-in and sign-up.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { User } from "../dataModels/User.js";
import { AppError } from "../shared/AppError.js";
import { asyncHandler } from "../shared/asyncHandler.js";
import { getAdminEmail, isCEOEmail, isManagerEmail } from "../shared/access.js";

const createToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      isAdmin: isCEOEmail(user.email),
      isManager: isManagerEmail(user.email)
    },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: isCEOEmail(user.email),
  isManager: isManagerEmail(user.email),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  if (isCEOEmail(email)) {
    process.env.ADMIN_EMAIL = getAdminEmail();
  }

  return { user, token: createToken(user) };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.passwordHash) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  return { user, token: createToken(user) };
};

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

const registerController = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({ user: sanitizeUser(result.user), token: result.token });
});

const loginController = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json({ user: sanitizeUser(result.user), token: result.token });
});

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);