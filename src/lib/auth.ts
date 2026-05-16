import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { Role } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

const COOKIE_NAME = "edlive_session";
const COOKIE_USER_NAME = "edlive_user";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  id: number;
  email: string;
  name: string;
  role: Role;
  avatar: string | null;
  iat?: number;
  exp?: number;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    id: payload.id,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    avatar: payload.avatar,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export function setUserCookie(response: NextResponse, user: SessionPayload) {
  const userData = Buffer.from(JSON.stringify({
    id: user.id,
    email: user.email,
    display_name: user.name,
    role: user.role,
    avatar_url: user.avatar,
  })).toString("base64");

  response.cookies.set(COOKIE_USER_NAME, userData, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set(COOKIE_USER_NAME, "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });
}

export function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export const ALLOWED_ROLES = {
  owner: ["owner"],
  admin: ["owner", "admin"],
  moderator: ["owner", "admin", "moderator"],
  mc: ["owner", "admin", "mc"],
  user: ["owner", "admin", "moderator", "mc", "user"],
  guest: ["owner", "admin", "moderator", "mc", "user", "guest"],
} as const;

export function checkRole(userRole: string | undefined, allowed: readonly string[]): boolean {
  if (!userRole) return allowed.includes("guest");
  return allowed.includes(userRole);
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
