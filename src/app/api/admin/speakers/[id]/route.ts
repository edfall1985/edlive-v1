import { NextResponse } from "next/server";
import { db } from "@/db";
import { speakers } from "@/db/schema";
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
  const { display_name, title, position, speaking_order, is_active, is_speaking } = body;

  const existing = await db.select().from(speakers).where(eq(speakers.id, parseInt(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
  }

  await db.update(speakers)
    .set({
      ...(display_name && { display_name }),
      ...(title !== undefined && { title }),
      ...(position && { position }),
      ...(speaking_order !== undefined && { speaking_order }),
      ...(is_active !== undefined && { is_active }),
      ...(is_speaking !== undefined && { is_speaking }),
    })
    .where(eq(speakers.id, parseInt(id)));

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
  const existing = await db.select().from(speakers).where(eq(speakers.id, parseInt(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
  }

  await db.delete(speakers).where(eq(speakers.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
