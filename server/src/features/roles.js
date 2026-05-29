// Roles feature: role CRUD, permission editing, and the admin-only roles route.
// Roles feature: role CRUD, permission editing, and the admin-only roles route.
// It manages role templates and what those roles can do.
// Use this file to understand role administration.
import { Router } from "express";
import { Role } from "../dataModels/Role.js";
import { AppError } from "../shared/AppError.js";
import { asyncHandler } from "../shared/asyncHandler.js";
import { requirePrivileged, requireAdmin } from "../middleware/access.js";

export const createRole = async ({ name, permissions = [] }) => {
  if (!name) {
    throw new AppError("Role name is required", 400);
  }

  if (name && name.toLowerCase() === 'superadmin') {
    throw new AppError('The SuperAdmin role is deprecated and cannot be created', 400);
  }

  return Role.create({ name, permissions });
};

export const listRoles = async () =>
  // Exclude any legacy SuperAdmin role from lists (case-insensitive)
  Role.find({ name: { $not: { $regex: '^superadmin$', $options: 'i' } } }).sort({ createdAt: -1 });

export const updateRolePermissions = async (roleId, permissions = []) => {
  const role = await Role.findByIdAndUpdate(roleId, { permissions }, { new: true, runValidators: true });

  if (!role) {
    throw new AppError("Role not found", 404);
  }

  return role;
};

const createRoleController = asyncHandler(async (req, res) => {
  const role = await createRole(req.body);
  res.status(201).json(role);
});

const getRolesController = asyncHandler(async (req, res) => {
  const roles = await listRoles();
  res.json(roles);
});

const updateRolePermissionsController = asyncHandler(async (req, res) => {
  const role = await updateRolePermissions(req.params.id, req.body.permissions);
  res.json(role);
});

export const rolesRouter = Router();

rolesRouter.post("/", requireAdmin, createRoleController);
rolesRouter.get("/", requirePrivileged, getRolesController);
rolesRouter.put("/:id/permissions", requireAdmin, updateRolePermissionsController);