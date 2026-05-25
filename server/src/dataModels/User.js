// User model: stores user identity and optional password hash.
// It holds the account data used for login.
// Use this file to understand user storage.
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);
