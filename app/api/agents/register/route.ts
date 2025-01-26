import { NextResponse } from "next/server";
// import {
//   selfIssueCertificate,
//   generateRsaKeyPair,
//   registerAutoId,
// } from "@autonomys/auto-id";
// import { activate } from "@autonomys/auto-utils";
import User from "@/models/User"; // Import your User model
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: Request) {
  await connectToDatabase();

  const { userId, agentName } = await req.json();

  if (!userId || !agentName) {
    return NextResponse.json(
      { error: "userId and agentName are required." },
      { status: 400 }
    );
  }

  try {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return NextResponse.json(
        { message: "User is already registered." },
        { status: 400 }
      );
    }

    // // Generate cryptographic keys
    // const keyPair = await generateRsaKeyPair();

    // // Generate a certificate
    // const certificate = await selfIssueCertificate(agentName, keyPair, 365);

    // // Activate API connection
    // const api = await activate({ networkId: "gemini-3h" });

    // // Register Auto ID
    // const tx = registerAutoId(api, certificate);

    // Create a new user object to save in the database
    const newUser = new User({
      userId,
      autoId: userId + agentName, // Use the unique ID from the transaction
      agentName,
      createdAt: new Date(),
    });

    // Save the user to the database
    await newUser.save();

    return NextResponse.json({
      message: "User registered successfully.",
      user: {
        userId: newUser.userId,
        autoId: newUser.autoId,
        agentName: newUser.agentName,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      { error: "Registration failed due to an internal error." },
      { status: 500 }
    );
  }
}
