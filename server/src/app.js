// App bootstrap: configures Express, CORS, and global middleware.
// It connects authentication, API routes, and error handling.
// Use this file to understand the server setup flow.
import express from "express";
import cors from "cors";
import { authRoutes, apiRoutes } from "./routes.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  const allowedOrigin = process.env.CLIENT_URL || true;
  const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigin === true || origin === allowedOrigin || localOriginPattern.test(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api", requireAuth, apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
