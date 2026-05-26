// Permissions feature: resolves team-scoped permissions for a given user.
// Permissions feature: resolves team-scoped permissions for a given user.
// It checks the user's membership and returns allowed actions.
// Use this file to understand permission lookup.
import { Router } from "express";
import { Membership } from "../dataModels/Membership.js";
import { asyncHandler } from "../shared/asyncHandler.js";
import { isAdminEmail, isPrivilegedEmail } from "../shared/access.js";

export const resolvePermissionsForUserTeam = async ({ userId, teamId, email }) => {
  if (isAdminEmail(email)) {
    return ["CREATE_TASK", "EDIT_TASK", "DELETE_TASK", "VIEW_ONLY", "MANAGE_USERS"];
  }

  const membership = await Membership.findOne({ userId, teamId }).populate("roleId");

  if (!membership || !membership.roleId) {
    return [];
  }

  return membership.roleId.permissions || [];
};

const getPermissionsController = asyncHandler(async (req, res) => {
  const requestingUserId = req.authUser.sub;
  const targetUserId = req.params.userId;

  const allowed =
    requestingUserId === targetUserId ||
    isAdminEmail(req.authUser.email) ||
    isPrivilegedEmail(req.authUser.email);

  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const permissions = await resolvePermissionsForUserTeam({ ...req.params, email: req.authUser.email });
  res.json({ userId: req.params.userId, teamId: req.params.teamId, permissions });
});

export const permissionsRouter = Router();

permissionsRouter.get('/:userId/:teamId', getPermissionsController);