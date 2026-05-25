import { asyncHandler } from "../utils/asyncHandler.js";
import { createRole, listRoles, updateRolePermissions } from "../services/roleService.js";

export const createRoleController = asyncHandler(async (req, res) => {
  const role = await createRole(req.body);
  res.status(201).json(role);
});

export const getRolesController = asyncHandler(async (req, res) => {
  const roles = await listRoles();
  res.json(roles);
});

export const updateRolePermissionsController = asyncHandler(async (req, res) => {
  const role = await updateRolePermissions(req.params.id, req.body.permissions);
  res.json(role);
});
