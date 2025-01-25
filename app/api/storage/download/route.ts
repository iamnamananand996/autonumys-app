import { NextResponse } from "next/server";
import { createAutoDriveApi, downloadFile } from "@autonomys/auto-drive";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cid = url.searchParams.get("cid"); // Get the CID from query parameters
  const fileType =
    url.searchParams.get("fileType") || "application/octet-stream"; // Get the file type, fallback to generic binary
  const fileName = url.searchParams.get("fileName") || "downloaded-file"; // Get the file name, fallback to default

  if (!cid) {
    return NextResponse.json({ error: "CID is required" }, { status: 400 });
  }

  const api = createAutoDriveApi({
    apiKey: process.env.AUTONOMYS_API_KEY || "",
  });

  try {
    const fileStream = await downloadFile(api, cid); // Stream the file from decentralized storage

    const chunks: Uint8Array[] = [];
    for await (const chunk of fileStream) {
      chunks.push(chunk);
    }

    // Combine all chunks into a single Uint8Array buffer
    const fileBuffer = Buffer.concat(chunks);

    // Ensure proper headers are sent for the file
    const headers = new Headers();
    headers.set("Content-Type", fileType); // Use the fileType passed from the frontend
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`); // Use the fileName passed from the frontend

    return new Response(fileBuffer, { headers });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Failed to download file." },
      { status: 500 }
    );
  }
}
