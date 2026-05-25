import { Router } from "express";
import { createTeamController, getTeamsController } from "../controllers/teamController.js";

const router = Router();

router.post("/", createTeamController);
router.get("/", getTeamsController);

export default router;
