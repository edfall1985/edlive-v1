import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const debateId = searchParams.get("debate_id");
  const flagged = searchParams.get("flagged");

  let results;
  if (flagged === "true") {
    results = await db.select().from(comments).where(eq(comments.is_moderated, true)).orderBy(desc(comments.created_at));
  } else if (debateId) {
    results = await db.select().from(comments).where(eq(comments.debate_id, parseInt(debateId))).orderBy(desc(comments.created_at));
  } else {
    results = await db.select().from(comments).orderBy(desc(comments.created_at));
  }

  return NextResponse.json({ comments: results });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { debate_id, content, is_moderated } = body;

  if (!debate_id || !content) {
    return NextResponse.json({ error: "debate_id and content are required" }, { status: 400 });
  }

  await db.insert(comments).values({
    debate_id: parseInt(debate_id),
    display_name: session.name,
    content,
    is_moderated: is_moderated || false,
    likes_count: 0,
    is_highlighted: false,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
