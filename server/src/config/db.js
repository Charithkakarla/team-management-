// Database config: connects Mongoose to MongoDB.
// It reads the database URL and opens the connection.
// Use this file to understand how the backend reaches MongoDB.
import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  return mongoose.connection;
};
