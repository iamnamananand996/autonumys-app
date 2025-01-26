import { NextResponse } from "next/server";
import User from "@/models/User"; // Import your User model
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Parse the request body
    const { userId, agentName } = await req.json();

    // Validate inputs
    if (!userId || !agentName) {
      return NextResponse.json(
        { error: "User ID and Agent Name are required." },
        { status: 400 }
      );
    }

    // Query the database
    const user = await User.findOne({
      userId,
      agentName,
      autoId: userId + agentName,
    });

    if (user) {
      // User found
      return NextResponse.json({
        message: "User successfully logged in.",
        user: {
          userId: user.userId,
          agentName: user.agentName,
          autoId: user.autoId,
        },
      });
    } else {
      // User not found
      return NextResponse.json(
        { message: "User not found. Please register." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "An error occurred during login." },
      { status: 500 }
    );
  }
}
