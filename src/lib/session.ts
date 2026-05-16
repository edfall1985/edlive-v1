import { cookies } from "next/headers";
import { verifySessionToken, type SessionPayload } from "./auth";

const COOKIE_NAME = "edlive_session";
const COOKIE_USER_NAME = "edlive_user";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getUserFromCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(COOKIE_USER_NAME)?.value;
  if (!userCookie) return null;
  try {
    const decoded = Buffer.from(userCookie, "base64").toString("utf-8");
    return JSON.parse(decoded) as SessionPayload;
  } catch {
    return null;
  }
}
