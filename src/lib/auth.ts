import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export interface JwtUser {
  id: number;
  email: string;
  name: string;
  role: "owner" | "admin" | "moderator" | "mc" | "user";
  avatar: string | null;
}

export function verifyToken(token: string): JwtUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUser;
  } catch {
    return null;
  }
}

export function getTokenFromCookie(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const tokenCookie = cookies.find((c) => c.startsWith("edlive_token="));
  if (!tokenCookie) return null;

  return tokenCookie.split("=")[1];
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
