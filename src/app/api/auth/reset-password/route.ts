import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const dbUser = await db.select().from(users).where(eq(users.email, email)).then((rows) => rows[0]);
  if (!dbUser) {
    // Don't reveal if user exists
    return NextResponse.json({ success: true, message: "If the email exists, a reset link has been sent" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.update(users)
    .set({
      reset_token: resetToken,
      reset_token_expires: expiresAt,
    })
    .where(eq(users.id, dbUser.id));

  const resetUrl = `${process.env.NEXT_PUBLIC_EDLIVE_URL || "http://localhost:4001"}/auth/reset-password/confirm?token=${resetToken}&email=${encodeURIComponent(email)}`;

  // In production, send email here. For now, return the URL for testing.
  return NextResponse.json({
    success: true,
    message: "If the email exists, a reset link has been sent",
    resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
  });
}
