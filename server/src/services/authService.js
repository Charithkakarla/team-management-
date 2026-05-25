import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

const createToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );

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

  return {
    user,
    token: createToken(user)
  };
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

  return {
    user,
    token: createToken(user)
  };
};

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
