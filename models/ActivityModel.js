import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "created task",
        "updated task status",
        "deleted task",
        "assigned task",
        "updated task priority",
      ],
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    taskTitle: {
      type: String,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    details: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Activity =
  mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

export default Activity;
