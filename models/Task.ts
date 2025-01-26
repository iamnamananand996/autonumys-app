import mongoose from "mongoose";

// Task schema and model
const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  fileName: { type: String, required: true },
  cid: { type: String, required: true },
  status: { type: String, default: "InProgress" }, // Status defaults to "InProgress"
  rewardPoints: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
