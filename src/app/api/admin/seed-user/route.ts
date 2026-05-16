import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.ADMIN_SEED_SECRET || !process.env.ADMIN_SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { email, password, display_name, role } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return NextResponse.json({ error: "User already exists", user: existing[0] }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    email,
    password_hash: passwordHash,
    display_name: display_name || email.split("@")[0],
    role: role || "user",
    is_active: true,
  });

  return NextResponse.json({ success: true, message: "User created" }, { status: 201 });
}
