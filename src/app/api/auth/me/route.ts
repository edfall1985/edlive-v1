import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const dbUser = await db.select().from(users).where(eq(users.id, session.id)).then((rows) => rows[0]);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      email: session.email,
      display_name: session.name,
      role: session.role,
      avatar_url: session.avatar,
      has_password: !!dbUser?.password_hash,
    },
  });
}
