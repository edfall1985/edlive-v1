import { NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const debateId = searchParams.get("debate_id");
  const approved = searchParams.get("approved");

  let results;
  if (approved === "true") {
    results = await db.select().from(media).where(eq(media.is_approved, true)).orderBy(desc(media.created_at));
  } else if (approved === "false") {
    results = await db.select().from(media).where(eq(media.is_approved, false)).orderBy(desc(media.created_at));
  } else if (debateId) {
    results = await db.select().from(media).where(eq(media.debate_id, parseInt(debateId))).orderBy(desc(media.created_at));
  } else {
    results = await db.select().from(media).orderBy(desc(media.created_at));
  }

  return NextResponse.json({ media: results });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { debate_id, title, media_type, url, description } = body;

  if (!debate_id || !media_type || !url) {
    return NextResponse.json({ error: "debate_id, media_type, and url are required" }, { status: 400 });
  }

  await db.insert(media).values({
    debate_id: parseInt(debate_id),
    title: title || null,
    media_type,
    url,
    description: description || null,
    is_approved: false,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
