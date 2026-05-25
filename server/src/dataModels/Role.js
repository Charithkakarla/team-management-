// Role model: stores role names and allowed permissions.
// It defines the access bundle assigned to members.
// Use this file to understand role templates.
import mongoose from "mongoose";
import { PERMISSIONS } from "../constants/permissions.js";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    permissions: {
      type: [String],
      default: ["VIEW_ONLY"],
      validate: {
        validator: (permissions) => permissions.every((permission) => PERMISSIONS.includes(permission)),
        message: "One or more permissions are invalid"
      }
    }
  },
  {
    timestamps: true
  }
);

export const Role = mongoose.model("Role", roleSchema);
