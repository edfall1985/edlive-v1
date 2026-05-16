import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { current_password, new_password, confirm_password } = body;

  if (!new_password) {
    return NextResponse.json({ error: "New password is required" }, { status: 400 });
  }

  if (!confirm_password) {
    return NextResponse.json({ error: "Password confirmation is required" }, { status: 400 });
  }

  if (new_password !== confirm_password) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
  }

  if (new_password.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
  }

  const dbUser = await db.select().from(users).where(eq(users.id, session.id)).then((rows) => rows[0]);
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // If user has a password, verify current password
  if (dbUser.password_hash) {
    if (!current_password) {
      return NextResponse.json({ error: "Current password is required" }, { status: 400 });
    }
    const isValid = await bcrypt.compare(current_password, dbUser.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);

  await db.update(users)
    .set({ password_hash: hashedPassword })
    .where(eq(users.id, session.id));

  return NextResponse.json({ success: true, message: "Password set successfully" });
}
