import { Team } from "../models/Team.js";
import { AppError } from "../utils/AppError.js";

export const createTeam = async ({ name, description = "" }) => {
  if (!name) {
    throw new AppError("Team name is required", 400);
  }

  return Team.create({ name, description });
};

export const listTeams = async () => Team.find().sort({ createdAt: -1 });
