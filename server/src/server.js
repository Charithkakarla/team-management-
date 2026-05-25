// Server entry point: loads env vars, connects the DB, and starts Express.
// It is the first file that runs when the backend starts.
// Use this file to understand the server startup flow.
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'),
  override: true
});

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;
const app = createApp();

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
