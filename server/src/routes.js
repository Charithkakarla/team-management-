// Route registry: keeps all API routes in one readable place.
// Route registry: keeps all API routes in one readable place.
// It mounts each feature router under its API path.
// Use this file to understand the backend route map.
import { Router } from "express";
import { authRouter } from "./features/auth.js";
import { usersRouter } from "./features/users.js";
import { teamsRouter } from "./features/teams.js";
import { rolesRouter } from "./features/roles.js";
import { membershipsRouter } from "./features/memberships.js";
import { permissionsRouter } from "./features/permissions.js";
import { tasksRouter } from "./features/tasks.js";
import { chatRouter } from "./features/chat.js";
import { realtimeRouter } from "./features/realtime.js";

const apiRouter = Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/teams", teamsRouter);
apiRouter.use("/roles", rolesRouter);
apiRouter.use("/memberships", membershipsRouter);
apiRouter.use("/permissions", permissionsRouter);
apiRouter.use("/tasks", tasksRouter);
apiRouter.use("/chat", chatRouter);
apiRouter.use("/realtime", realtimeRouter);

export const authRoutes = authRouter;
export const apiRoutes = apiRouter;