import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User"; // Import your User model

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
  try {
    // Parse the request body
    const { userId, agentName, autoId } = await req.json();

    // Validate inputs
    if (!userId || !agentName || !autoId) {
      return NextResponse.json(
        { error: "User ID, Agent Name, and Auto ID are required." },
        { status: 400 }
      );
    }

    // Find the user with the given combination
    const user = await User.findOne({
      userId,
      agentName,
      autoId,
    });

    if (user) {
      // User found, send success response
      return NextResponse.json({
        message: "User successfully logged in.",
        user: {
          userId: user.userId,
          agentName: user.agentName,
          autoId: user.autoId.autoId,
        },
      });
    } else {
      // User not found, suggest registration
      return NextResponse.json(
        { message: "User not found. Please register." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { error: "An error occurred during login." },
      { status: 500 }
    );
  }
}
