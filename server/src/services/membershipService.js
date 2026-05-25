import { Membership } from "../models/Membership.js";
import { AppError } from "../utils/AppError.js";

export const addMembership = async ({ userId, teamId, roleId = null }) => {
  if (!userId || !teamId) {
    throw new AppError("userId and teamId are required", 400);
  }

  return Membership.findOneAndUpdate(
    { userId, teamId },
    { userId, teamId, roleId },
    { new: true, upsert: true, runValidators: true }
  ).populate("userId teamId roleId");
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

  const membership = await Membership.findOneAndUpdate(
    { userId, teamId },
    { roleId },
    { new: true, runValidators: true, upsert: true }
  ).populate("userId teamId roleId");

  return membership;
};

export const updateMembershipRole = assignRoleToMembership;
