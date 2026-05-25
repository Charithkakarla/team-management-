import { asyncHandler } from "../utils/asyncHandler.js";
import { createTeam, listTeams } from "../services/teamService.js";

export const createTeamController = asyncHandler(async (req, res) => {
  const team = await createTeam(req.body);
  res.status(201).json(team);
});

export const getTeamsController = asyncHandler(async (req, res) => {
  const teams = await listTeams();
  res.json(teams);
});
