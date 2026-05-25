import { Router } from "express";
import { createUserController, getUsersController } from "../controllers/userController.js";

const router = Router();

router.post("/", createUserController);
router.get("/", getUsersController);

export default router;
