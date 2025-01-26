import { NextResponse } from "next/server";
import { createAutoDriveApi, uploadFile } from "@autonomys/auto-drive";
import Task from "@/models/Task";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: Request) {
  await connectToDatabase();

  const { taskName, taskDescription, file, fileName, rewardPoints } =
    await req.json();

  if (
    !taskName ||
    !taskDescription ||
    !file || // Base64-encoded file content
    !fileName ||
    !rewardPoints
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const api = createAutoDriveApi({
    apiKey: process.env.AUTONOMYS_API_KEY || "",
  });

  try {
    // Decode the Base64 file content to a buffer
    const base64Data = file.replace(/^data:.*;base64,/, ""); // Remove the Base64 prefix
    const fileBuffer = Buffer.from(base64Data, "base64");

    // Upload file to decentralized storage and get CID
    const cid = await uploadFile(api, {
      read: async function* () {
        yield fileBuffer;
      },
      name: fileName,
      size: fileBuffer.length,
    });

    // Create a task in the database
    const newTask = new Task({
      taskName,
      taskDescription,
      fileName,
      cid: cid,
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
