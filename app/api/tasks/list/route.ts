import { NextResponse } from "next/server";
import Task from "@/models/Task";
import { connectToDatabase } from "@/lib/mongoose";

export async function GET(req: Request) {
  await connectToDatabase();

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
