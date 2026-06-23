import { NextResponse } from "next/server";
import { loadAppState, saveAppState } from "@/lib/db/roadmap-service";

export async function GET() {
  try {
    const state = await loadAppState();
    return NextResponse.json(state);
  } catch (error) {
    console.error("GET /api/sync failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await saveAppState(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/sync failed:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
