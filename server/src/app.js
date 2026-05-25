import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || true,
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
