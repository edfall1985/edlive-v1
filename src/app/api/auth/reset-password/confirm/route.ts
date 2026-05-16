import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { token, email, new_password, confirm_password } = body;

  if (!token || !email || !new_password) {
    return NextResponse.json({ error: "Token, email, and new password are required" }, { status: 400 });
  }

  if (!confirm_password) {
    return NextResponse.json({ error: "Password confirmation is required" }, { status: 400 });
  }

  if (new_password !== confirm_password) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
  }

  if (new_password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const dbUser = await db.select().from(users).where(
    and(
      eq(users.email, email),
      eq(users.reset_token, token),
      gt(users.reset_token_expires, new Date())
    )
  ).then((rows) => rows[0]);

  if (!dbUser) {
    return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);

  await db.update(users)
    .set({
      password_hash: hashedPassword,
      reset_token: null,
      reset_token_expires: null,
    })
    .where(eq(users.id, dbUser.id));

  return NextResponse.json({ success: true, message: "Password reset successfully" });
}
