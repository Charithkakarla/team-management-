import { Router } from "express";
import { getPermissionsController } from "../controllers/permissionController.js";

const router = Router();

router.get("/:userId/:teamId", getPermissionsController);

export default router;
