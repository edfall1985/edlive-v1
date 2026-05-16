import { NextResponse } from "next/server";
import { db } from "@/db";
import { debates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await db.select().from(debates).where(eq(debates.id, parseInt(id)));

  if (result.length === 0) {
    return NextResponse.json({ error: "Debate not found" }, { status: 404 });
  }

  return NextResponse.json({ debate: result[0] });
}

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
  const { title, motion, description, status, session_type, current_phase, tiktok_live_url } = body;

  const existing = await db.select().from(debates).where(eq(debates.id, parseInt(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "Debate not found" }, { status: 404 });
  }

  await db.update(debates)
    .set({
      ...(title && { title }),
      ...(motion !== undefined && { motion }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      ...(session_type && { session_type }),
      ...(current_phase && { current_phase }),
      ...(tiktok_live_url !== undefined && { tiktok_live_url }),
    })
    .where(eq(debates.id, parseInt(id)));

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
  const existing = await db.select().from(debates).where(eq(debates.id, parseInt(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "Debate not found" }, { status: 404 });
  }

  await db.delete(debates).where(eq(debates.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
