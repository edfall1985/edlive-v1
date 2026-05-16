import { NextResponse } from "next/server";
import { db } from "@/db";
import { speakers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const debateId = searchParams.get("debate_id");

  let results;
  if (debateId) {
    results = await db.select().from(speakers).where(eq(speakers.debate_id, parseInt(debateId))).orderBy(desc(speakers.speaking_order));
  } else {
    results = await db.select().from(speakers).orderBy(desc(speakers.speaking_order));
  }

  return NextResponse.json({ speakers: results });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { debate_id, display_name, title, position, speaking_order, avatar_url } = body;

  if (!debate_id || !display_name || !position) {
    return NextResponse.json({ error: "debate_id, display_name, and position are required" }, { status: 400 });
  }

  await db.insert(speakers).values({
    debate_id: parseInt(debate_id),
    display_name,
    title: title || null,
    position,
    speaking_order: speaking_order || 0,
    avatar_url: avatar_url || null,
    is_active: true,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
