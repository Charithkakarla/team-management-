import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null
    }
  },
  {
    timestamps: true
  }
);

membershipSchema.index({ userId: 1, teamId: 1 }, { unique: true });

export const Membership = mongoose.model("Membership", membershipSchema);
