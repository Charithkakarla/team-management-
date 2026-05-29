// Teams feature: team CRUD and the privileged teams route.
// Teams feature: team CRUD and the privileged teams route.
// It contains the code for creating and listing teams.
// Use this file to understand team management endpoints.
import { Router } from "express";
import { Team } from "../dataModels/Team.js";
import { AppError } from "../shared/AppError.js";
import { asyncHandler } from "../shared/asyncHandler.js";
import { requirePrivileged, requireAdmin } from "../middleware/access.js";

export const createTeam = async ({ name, description = "" }) => {
  if (!name) {
    throw new AppError("Team name is required", 400);
  }

  return Team.create({ name, description });
};

export const listTeams = async () => Team.find().sort({ createdAt: -1 });

const createTeamController = asyncHandler(async (req, res) => {
  const team = await createTeam(req.body);
  res.status(201).json(team);
});

const getTeamsController = asyncHandler(async (req, res) => {
  const teams = await listTeams();
  res.json(teams);
});

export const teamsRouter = Router();

teamsRouter.post("/", requireAdmin, createTeamController);
teamsRouter.get("/", requirePrivileged, getTeamsController);