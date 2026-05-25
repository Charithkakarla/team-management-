import { asyncHandler } from "../utils/asyncHandler.js";
import { createUser, listUsers } from "../services/userService.js";

export const createUserController = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});

export const getUsersController = asyncHandler(async (req, res) => {
  const users = await listUsers();
  res.json(users);
});
