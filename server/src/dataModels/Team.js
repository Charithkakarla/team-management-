// Team model: stores team names and descriptions.
// It represents the work groups in the app.
// Use this file to understand team records.
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const Team = mongoose.model("Team", teamSchema);
