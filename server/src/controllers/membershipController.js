import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addMembership,
  removeMembership,
  assignRoleToMembership,
  updateMembershipRole
} from "../services/membershipService.js";

export const addUserToTeamController = asyncHandler(async (req, res) => {
  const membership = await addMembership(req.body);
  res.status(201).json(membership);
});

export const removeUserFromTeamController = asyncHandler(async (req, res) => {
  const result = await removeMembership(req.body);
  res.json({ message: "Membership removed", membership: result });
});

export const assignRoleController = asyncHandler(async (req, res) => {
  const membership = await assignRoleToMembership(req.body);
  res.status(201).json(membership);
});

export const updateRoleController = asyncHandler(async (req, res) => {
  const membership = await updateMembershipRole(req.body);
  res.json(membership);
});
