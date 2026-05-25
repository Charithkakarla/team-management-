import { Router } from "express";
import userRoutes from "./userRoutes.js";
import teamRoutes from "./teamRoutes.js";
import roleRoutes from "./roleRoutes.js";
import membershipRoutes from "./membershipRoutes.js";
import permissionRoutes from "./permissionRoutes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/teams", teamRoutes);
router.use("/roles", roleRoutes);
router.use("/memberships", membershipRoutes);
router.use("/permissions", permissionRoutes);

export default router;
