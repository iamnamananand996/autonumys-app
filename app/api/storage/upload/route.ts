import { NextResponse } from "next/server";
import { createAutoDriveApi, uploadFile } from "@autonomys/auto-drive";

export async function POST(req: Request) {
  const { fileBuffer, fileName } = await req.json();
  const api = createAutoDriveApi({
    apiKey: process.env.AUTONOMYS_API_KEY || "",
  });

  try {
    const cid = await uploadFile(api, {
      read: async function* () {
        yield Buffer.from(fileBuffer);
      },
      name: fileName,
      size: fileBuffer.length,
    });

    return NextResponse.json({ cid });
  } catch (error) {
    console.error("File Upload Failed:", error);
    return NextResponse.json({ error: "File upload failed." }, { status: 500 });
  }
}
