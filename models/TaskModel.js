import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const TaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      default: uuidv4,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default:
        "This Task should be done within the deadline else marks will be deducted",
    },

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // user's mongoDB objectID will be stored here, better than userID:uuid() , if want to establish relation on backend and can use .populate too which we'll see later
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
