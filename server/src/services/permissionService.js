import { Membership } from "../models/Membership.js";

export const resolvePermissionsForUserTeam = async ({ userId, teamId }) => {
  const membership = await Membership.findOne({ userId, teamId }).populate("roleId");

  if (!membership || !membership.roleId) {
    return [];
  }

  return membership.roleId.permissions || [];
};
