import { Router } from "express";
import {
  addUserToTeamController,
  removeUserFromTeamController,
  assignRoleController,
  updateRoleController
} from "../controllers/membershipController.js";

const router = Router();

router.post("/add-user", addUserToTeamController);
router.post("/remove-user", removeUserFromTeamController);
router.post("/assign-role", assignRoleController);
router.put("/update-role", updateRoleController);

export default router;
