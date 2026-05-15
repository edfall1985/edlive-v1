import { db } from "@/db";
import { debates } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const all = await db
      .select()
      .from(debates)
      .orderBy(desc(debates.created_at));

    return NextResponse.json(all);
  } catch (error) {
    console.error("GET /api/debates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
