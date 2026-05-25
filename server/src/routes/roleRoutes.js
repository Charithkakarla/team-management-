import { Router } from "express";
import {
  createRoleController,
  getRolesController,
  updateRolePermissionsController
} from "../controllers/roleController.js";

const router = Router();

router.post("/", createRoleController);
router.get("/", getRolesController);
router.put("/:id/permissions", updateRolePermissionsController);

export default router;
