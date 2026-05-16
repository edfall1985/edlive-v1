import { verifySessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const user = await verifySessionToken(token);
    if (!user) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ valid: true, user });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
