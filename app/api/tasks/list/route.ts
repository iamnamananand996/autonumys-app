import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Task from "@/models/Task"; // Assuming you have a Task model

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

export async function GET(req: Request) {
  try {
    // Parse query parameters for pagination (optional)
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Fetch tasks with pagination
    const tasks = await Task.find().skip(skip).limit(limit).exec();
    const totalTasks = await Task.countDocuments();

    return NextResponse.json({
      tasks,
      pagination: {
        total: totalTasks,
        limit,
        page,
        totalPages: Math.ceil(totalTasks / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks." },
      { status: 500 }
    );
  }
}
