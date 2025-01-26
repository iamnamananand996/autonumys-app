import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // Unique user ID
    autoId: { type: String, required: true, unique: true }, // Unique Auto ID
    agentName: { type: String, required: true }, // Agent name
    createdAt: { type: Date, default: Date.now }, // Timestamp of creation
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

// Use the existing model if it exists; otherwise, create a new model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
