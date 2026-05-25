import { asyncHandler } from "../utils/asyncHandler.js";
import { resolvePermissionsForUserTeam } from "../services/permissionService.js";

export const getPermissionsController = asyncHandler(async (req, res) => {
  const permissions = await resolvePermissionsForUserTeam(req.params);
  res.json({
    userId: req.params.userId,
    teamId: req.params.teamId,
    permissions
  });
});
