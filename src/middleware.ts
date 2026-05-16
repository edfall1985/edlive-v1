import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Check for user cookie (readable cookie with user info)
  const userCookie = request.cookies.get("edlive_user")?.value;
  const isAuthenticated = !!userCookie;

  // Admin routes - require owner or admin role
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    try {
      const userData = JSON.parse(Buffer.from(userCookie, "base64").toString("utf-8"));
      if (!["owner", "admin"].includes(userData.role)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protected routes
  const isProtectedRoute = pathname.startsWith("/debate");
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot)$).*)"],
};
