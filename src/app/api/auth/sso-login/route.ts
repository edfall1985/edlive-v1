import { NextResponse } from "next/server";
import { verifySessionToken, setSessionCookie, setUserCookie, decodeJwtPayload } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Try jose verification first (for tokens created by this app)
    let session = await verifySessionToken(token);

    // Fallback: decode payload for SSO tokens (signed by SSO server with same secret)
    if (!session) {
      const payload = decodeJwtPayload(token);
      if (!payload) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      session = {
        id: payload.id || 0,
        email: payload.email || "",
        name: payload.name || payload.email?.split("@")[0] || "User",
        role: payload.role || "user",
        avatar: payload.avatar || null,
      };
    }

    const response = NextResponse.json({ success: true });
    setSessionCookie(response, token);
    setUserCookie(response, session);

    return response;
  } catch (err) {
    console.error("[SSO Login] Error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
