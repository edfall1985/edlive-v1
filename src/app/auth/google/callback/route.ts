import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie, setUserCookie } from "@/lib/auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:4001/auth/google/callback";
const EDLIVE_URL = process.env.NEXT_PUBLIC_EDLIVE_URL || "http://localhost:4001";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("[Google Auth] Error:", error);
    return NextResponse.redirect(`${EDLIVE_URL}/?auth_error=google_denied`);
  }

  if (!code) {
    return NextResponse.redirect(`${EDLIVE_URL}/?auth_error=no_code`);
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errData = await tokenResponse.json().catch(() => ({}));
      console.error("[Google Auth] Token exchange failed:", errData);
      return NextResponse.redirect(`${EDLIVE_URL}/?auth_error=exchange_failed`);
    }

    const tokens = await tokenResponse.json();

    // Fetch user info using ID token (OIDC)
    const idToken = tokens.id_token;
    if (!idToken) {
      return NextResponse.redirect(`${EDLIVE_URL}/?auth_error=no_id_token`);
    }

    // Decode ID token to get user info
    const parts = idToken.split(".");
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));

    if (!payload.email) {
      return NextResponse.redirect(`${EDLIVE_URL}/?auth_error=no_email`);
    }

    // Create session
    const sessionPayload = {
      id: 0,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      role: "user" as const,
      avatar: payload.picture || null,
    };

    const sessionToken = await createSessionToken(sessionPayload);

    // Set cookies and redirect
    const response = NextResponse.redirect(`${EDLIVE_URL}/`);
    setSessionCookie(response, sessionToken);
    setUserCookie(response, sessionPayload);

    return response;
  } catch (err) {
    console.error("[Google Auth] Unexpected error:", err);
    return NextResponse.redirect(`${EDLIVE_URL}/?auth_error=unexpected`);
  }
}
