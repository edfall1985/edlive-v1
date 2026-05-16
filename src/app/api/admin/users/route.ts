import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await db.select().from(users).orderBy(desc(users.created_at));
  return NextResponse.json({ users: results });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !["owner", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { email, display_name, role, avatar_url } = body;

  if (!email || !role) {
    return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
  }

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  await db.insert(users).values({
    email,
    display_name: display_name || null,
    role,
    avatar_url: avatar_url || null,
    is_active: true,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
