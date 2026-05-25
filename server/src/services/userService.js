import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

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
