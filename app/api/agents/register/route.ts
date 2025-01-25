import { NextResponse } from "next/server";
import {
  selfIssueCertificate,
  generateRsaKeyPair,
  registerAutoId,
} from "@autonomys/auto-id";
import { activate } from "@autonomys/auto-utils";

export async function POST(req: Request) {
  const { agentName } = await req.json();

  if (!agentName) {
    return NextResponse.json(
      { error: "Agent name is required" },
      { status: 400 }
    );
  }

  try {
    // Generate a cryptographic key pair
    const keyPair = await generateRsaKeyPair();

    // Generate an X.509 certificate
    const certificate = await selfIssueCertificate(agentName, keyPair, 365);

    // Activate the API connection
    const api = await activate({ networkId: "gemini-3h" });

    // Register the Auto ID with the certificate
    const tx = registerAutoId(api, certificate);

    // Return the transaction structure for further handling
    return NextResponse.json({ transaction: tx.toHuman() });
  } catch (error) {
    console.error("Agent Registration Failed:", error);
    return NextResponse.json(
      { error: "Agent registration failed." },
      { status: 500 }
    );
  }
}
