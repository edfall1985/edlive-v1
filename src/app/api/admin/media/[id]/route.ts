import { NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
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
  const { is_approved, title, description } = body;

  const existing = await db.select().from(media).where(eq(media.id, parseInt(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  await db.update(media)
    .set({
      ...(is_approved !== undefined && { is_approved }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
    })
    .where(eq(media.id, parseInt(id)));

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
  const existing = await db.select().from(media).where(eq(media.id, parseInt(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  await db.delete(media).where(eq(media.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
