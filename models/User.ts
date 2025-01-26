import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  agentName: { type: String, required: true, index: true },
  autoId: { type: String, required: true, index: true },
  reward: { type: Number, default: 0 }, // New field for reward points
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
