// app/api/tasks/list/route.ts
import { NextResponse } from "next/server";
import { createAutoDriveApi, apiCalls, Scope } from "@autonomys/auto-drive";

export async function GET(request: Request) {
  const api = createAutoDriveApi({
    apiKey: process.env.AUTONOMYS_API_KEY || "",
  });

  try {
    // Parse query parameters from the request URL
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
    const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);

    // Get the scope from query parameters, fallback to 'Scope.User' if not provided
    const scopeParam = url.searchParams.get("scope") || "User";
    const scope = Scope[scopeParam as keyof typeof Scope] || Scope.User;

    // Fetch tasks from decentralized storage using Auto Drive's getRoots API
    const tasksResponse = await apiCalls.getRoots(api, {
      scope,
      limit,
      offset,
    });

    // tasksResponse has shape: { totalCount: number, rows: Root[] }
    // where rows is the array of items
    return NextResponse.json({
      rows: tasksResponse.rows,
      totalCount: tasksResponse.totalCount,
      limit,
      offset,
      scope: scopeParam,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks." },
      { status: 500 }
    );
  }
}
