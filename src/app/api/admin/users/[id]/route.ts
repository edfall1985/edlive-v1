import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
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
  const { display_name, role, avatar_url, is_active } = body;

  const existing = await db.select().from(users).where(eq(users.id, parseInt(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await db.update(users)
    .set({
      ...(display_name !== undefined && { display_name }),
      ...(role && { role }),
      ...(avatar_url !== undefined && { avatar_url }),
      ...(is_active !== undefined && { is_active }),
    })
    .where(eq(users.id, parseInt(id)));

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
  const existing = await db.select().from(users).where(eq(users.id, parseInt(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (existing[0].id === session.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  await db.delete(users).where(eq(users.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
