import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET() {
  const adminUsers = await db.select().from(users).where(eq(users.role, "owner"));
  if (adminUsers.length > 0) {
    return NextResponse.json({ hasAdmin: true, message: "Admin user already exists" });
  }
  return NextResponse.json({ hasAdmin: false, message: "No admin user found" });
}

export async function POST(req: Request) {
  const adminUsers = await db.select().from(users).where(eq(users.role, "owner"));
  if (adminUsers.length > 0) {
    return NextResponse.json({ error: "Admin user already exists. Use admin panel to manage users." }, { status: 400 });
  }

  const body = await req.json();
  const { email, password, display_name } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    email,
    password_hash: passwordHash,
    display_name: display_name || email.split("@")[0],
    role: "owner",
    is_active: true,
  });

  return NextResponse.json({ success: true, message: "Admin user created. You can now login and access /admin" });
}
