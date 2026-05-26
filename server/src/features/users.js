// Users feature: user CRUD and the privileged users route.
// Users feature: user CRUD and the privileged users route.
// It manages the user directory and its routes.
// Use this file to understand account management.
import { Router } from "express";
import { User } from "../dataModels/User.js";
import { AppError } from "../shared/AppError.js";
import { asyncHandler } from "../shared/asyncHandler.js";
import { requirePrivileged, requireSuperAdmin } from "../middleware/access.js";

export const createUser = async ({ name, email, passwordHash = null }) => {
  if (!name || !email) {
    throw new AppError("Name and email are required", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  return User.create({ name, email, passwordHash });
};

export const listUsers = async () => User.find().sort({ createdAt: -1 });

const createUserController = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});

const getUsersController = asyncHandler(async (req, res) => {
  const users = await listUsers();
  res.json(users);
});

export const usersRouter = Router();

usersRouter.post("/", requireSuperAdmin, createUserController);
usersRouter.get("/", requirePrivileged, getUsersController);