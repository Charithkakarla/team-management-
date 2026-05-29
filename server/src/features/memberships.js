// Memberships feature: adds, removes, and updates user roles in teams.
// Memberships feature: adds, removes, and updates user roles in teams.
// It keeps team membership changes in one place.
// Use this file to understand how users get linked to teams.
import { Router } from "express";
import { Membership } from "../dataModels/Membership.js";
import { AppError } from "../shared/AppError.js";
import { asyncHandler } from "../shared/asyncHandler.js";
import { requirePrivileged, requireAdmin } from "../middleware/access.js";
import { emitRoleChange } from "../shared/realtime.js";

export const addMembership = async ({ userId, teamId, roleId = null }) => {
  if (!userId || !teamId) {
    throw new AppError("userId and teamId are required", 400);
  }

  return Membership.findOneAndUpdate({ userId, teamId }, { userId, teamId, roleId }, { new: true, upsert: true, runValidators: true }).populate("userId teamId roleId");
};

export const removeMembership = async ({ userId, teamId }) => {
  if (!userId || !teamId) {
    throw new AppError("userId and teamId are required", 400);
  }

  const result = await Membership.findOneAndDelete({ userId, teamId });
  if (!result) {
    throw new AppError("Membership not found", 404);
  }

  return result;
};

export const assignRoleToMembership = async ({ userId, teamId, roleId }) => {
  if (!userId || !teamId || !roleId) {
    throw new AppError("userId, teamId and roleId are required", 400);
  }

  const membership = await Membership.findOneAndUpdate({ userId, teamId }, { roleId }, { new: true, runValidators: true, upsert: true }).populate("userId teamId roleId");
  emitRoleChange({
    userId,
    teamId,
    roleId,
    roleName: membership.roleId?.name,
    permissions: membership.roleId?.permissions || []
  });

  return membership;
};

export const updateMembershipRole = assignRoleToMembership;

export const listMembershipsByTeam = async (teamId) => {
  if (!teamId) {
    throw new AppError("teamId is required", 400);
  }

  return Membership.find({ teamId }).populate("userId teamId roleId").sort({ createdAt: -1 });
};

const addUserToTeamController = asyncHandler(async (req, res) => {
  const membership = await addMembership(req.body);
  res.status(201).json(membership);
});

const removeUserFromTeamController = asyncHandler(async (req, res) => {
  const result = await removeMembership(req.body);
  res.json({ message: "Membership removed", membership: result });
});

const assignRoleController = asyncHandler(async (req, res) => {
  const membership = await assignRoleToMembership(req.body);
  res.status(201).json(membership);
});

const updateRoleController = asyncHandler(async (req, res) => {
  const membership = await updateMembershipRole(req.body);
  res.json(membership);
});

const getTeamMembersController = asyncHandler(async (req, res) => {
  const memberships = await listMembershipsByTeam(req.params.teamId);
  res.json(memberships);
});

export const membershipsRouter = Router();

membershipsRouter.post("/add-user", requireAdmin, addUserToTeamController);
membershipsRouter.post("/remove-user", requirePrivileged, removeUserFromTeamController);
membershipsRouter.post("/assign-role", requireAdmin, assignRoleController);
membershipsRouter.put("/update-role", requireAdmin, updateRoleController);
membershipsRouter.get("/team/:teamId", requirePrivileged, getTeamMembersController);