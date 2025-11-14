import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["note", "call", "meeting", "email", "task"],
      required: [true, "Please provide an activity type"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    scheduledDate: {
      type: Date,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
activitySchema.index({ lead: 1, createdAt: -1 });
activitySchema.index({ createdBy: 1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
