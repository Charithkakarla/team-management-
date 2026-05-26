// Realtime feature: authenticated SSE stream for role-change notifications.
// It lets the client refresh auth and data as soon as a membership changes.
// Use this file to keep role-driven UI state in sync.
import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler.js";
import { subscribeToUser } from "../shared/realtime.js";

const streamController = asyncHandler(async (req, res) => {
  res.status(200);
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });

  if (typeof res.flushHeaders === "function") {
    res.flushHeaders();
  }

  const cleanup = subscribeToUser(req.authUser.sub, res);
  const heartbeat = setInterval(() => {
    res.write(`event: ping\n`);
    res.write(`data: ${JSON.stringify({ type: "ping", ts: Date.now() })}\n\n`);
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    cleanup();
  });
});

export const realtimeRouter = Router();

realtimeRouter.get("/stream", streamController);
