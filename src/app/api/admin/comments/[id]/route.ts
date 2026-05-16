import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { is_moderated, is_highlighted } = body;

  const existing = await db.select().from(comments).where(eq(comments.id, parseInt(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  await db.update(comments)
    .set({
      ...(is_moderated !== undefined && { is_moderated }),
      ...(is_highlighted !== undefined && { is_highlighted }),
    })
    .where(eq(comments.id, parseInt(id)));

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db.select().from(comments).where(eq(comments.id, parseInt(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  await db.delete(comments).where(eq(comments.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
