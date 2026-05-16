import { NextResponse } from "next/server";
import { db } from "@/db";
import { debates } from "@/db/schema";
import { eq, desc, like, or } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  let results;
  if (status) {
    results = await db.select().from(debates).where(eq(debates.status, status as any)).orderBy(desc(debates.created_at));
  } else if (search) {
    results = await db.select().from(debates).where(or(like(debates.title, `%${search}%`), like(debates.motion, `%${search}%`))).orderBy(desc(debates.created_at));
  } else {
    results = await db.select().from(debates).orderBy(desc(debates.created_at));
  }

  return NextResponse.json({ debates: results });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, motion, description, status, session_type, tiktok_live_url } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  await db.insert(debates).values({
    title,
    motion: motion || null,
    description: description || null,
    status: status || "scheduled",
    session_type: session_type || "education",
    tiktok_live_url: tiktok_live_url || null,
    created_by: session.id,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
