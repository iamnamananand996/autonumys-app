import { NextResponse } from "next/server";
// import { createAutoDriveApi, uploadFile } from "@autonomys/auto-drive";
import mongoose from "mongoose";
import Task from "@/models/Task";

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
  const { taskName, taskDescription, file, fileName, rewardPoints } =
    await req.json();

  if (!taskName || !taskDescription || !file || !fileName || !rewardPoints) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  // const api = createAutoDriveApi({
  //   apiKey: process.env.AUTONOMYS_API_KEY || "",
  // });

  try {
    // // Upload file to decentralized storage and get CID
    // const cid = await uploadFile(api, {
    //   read: async function* () {
    //     yield Buffer.from(file, "base64"); // Assuming the file is sent as a base64 string
    //   },
    //   name: fileName,
    //   size: Buffer.byteLength(file, "base64"),
    // });

    // Create a task in the database
    const newTask = new Task({
      taskName,
      taskDescription,
      fileName,
      cid: "Cid",
      status: "pending",
      rewardPoints,
    });

    await newTask.save();

    return NextResponse.json({
      message: "Task created successfully.",
      task: {
        taskName: newTask.taskName,
        taskDescription: newTask.taskDescription,
        fileName: newTask.fileName,
        cid: newTask.cid,
        status: newTask.status,
        rewardPoints: newTask.rewardPoints,
        createdAt: newTask.createdAt,
      },
    });
  } catch (error) {
    console.error("Task creation failed:", error);
    return NextResponse.json(
      { error: "Task creation failed." },
      { status: 500 }
    );
  }
}
