// app/api/tasks/list/route.ts
import { NextResponse } from "next/server";
import { createAutoDriveApi, apiCalls, Scope } from "@autonomys/auto-drive";

export async function GET() {
  const api = createAutoDriveApi({
    apiKey: process.env.AUTONOMYS_API_KEY || "",
  });

  try {
    // Fetch tasks from decentralized storage using Auto Drive's getRoots API
    const tasks = await apiCalls.getRoots(api, {
      scope: Scope.User, // Fetch tasks created by the user
      limit: 100, // Limit the number of results
      offset: 0, // Pagination offset
    });

    return NextResponse.json({ tasks: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks." },
      { status: 500 }
    );
  }
}
