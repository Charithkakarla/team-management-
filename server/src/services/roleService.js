import { Role } from "../models/Role.js";
import { AppError } from "../utils/AppError.js";

export const createRole = async ({ name, permissions = [] }) => {
  if (!name) {
    throw new AppError("Role name is required", 400);
  }

  return Role.create({ name, permissions });
};

export const listRoles = async () => Role.find().sort({ createdAt: -1 });

export const updateRolePermissions = async (roleId, permissions = []) => {
  const role = await Role.findByIdAndUpdate(
    roleId,
    { permissions },
    { new: true, runValidators: true }
  );

  if (!role) {
    throw new AppError("Role not found", 404);
  }

  return role;
};
