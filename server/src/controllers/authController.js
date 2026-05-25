import { asyncHandler } from "../utils/asyncHandler.js";
import { loginUser, registerUser } from "../services/authService.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const registerController = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({
    user: sanitizeUser(result.user),
    token: result.token
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json({
    user: sanitizeUser(result.user),
    token: result.token
  });
});
