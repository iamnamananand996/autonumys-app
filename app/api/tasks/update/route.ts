import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Task from "@/models/Task"; // Assuming you have a Task model for tasks

// Ensure MongoDB connection
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI || "")
    .then(() => {
      console.log("Connected to MongoDB Atlas successfully.");
    })
    .catch((error) => {
      console.error("Failed to connect to MongoDB Atlas:", error);
    });
}

export async function POST(req: Request) {
  const { taskId, userId, status } = await req.json();

  if (!taskId || !userId || !status) {
    return NextResponse.json(
      { error: "Task ID, User ID, and Status are required." },
      { status: 400 }
    );
  }

  try {
    // 1. Update the task status
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    task.status = status;
    await task.save();

    // 2. Find the user and update the reward points
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const rewardPoints = task.rewardPoints; // Reward points from the task object
    user.reward = (user.reward || 0) + rewardPoints; // Add reward points to the existing reward

    await user.save();

    return NextResponse.json({
      message: "Task status and user reward updated successfully.",
      task,
      user,
    });
  } catch (error) {
    console.error("Error updating task or user:", error);
    return NextResponse.json(
      { error: "Failed to update task or user." },
      { status: 500 }
    );
  }
}
