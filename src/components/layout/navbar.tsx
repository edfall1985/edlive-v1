"use client";

import { useAuthStore } from "@/stores/auth-store";

export function Navbar() {
  const { status, user, logout, isAllowed } = useAuthStore();
  const isAuthed = status === "authenticated";

  const handleLogout = () => {
    logout();
    const sso = process.env.NEXT_PUBLIC_SSO_URL || "http://localhost:3000";
    const edlive = window.location.origin;
    window.location.href = `${sso}/logout?callbackUrl=${encodeURIComponent(edlive)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-400 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg text-primary leading-tight">edLive</h1>
            <p className="text-xs text-secondary">Debate Command Center</p>
          </div>
        </a>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-lg" />
          ) : isAuthed ? (
            <div className="flex items-center gap-3">
              {user?.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              )}
              <span className="hidden sm:inline text-sm text-gray-600">
                {user?.display_name || user?.email?.split("@")[0]}
              </span>
              <span className="hidden sm:inline text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500 capitalize">
                {user?.role}
              </span>
              {isAllowed(["owner", "admin"]) && (
                <a
                  href="/admin"
                  className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Admin
                </a>
              )}
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href={`${process.env.NEXT_PUBLIC_SSO_URL || "http://localhost:3000"}/login?callbackUrl=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              </svg>
              Login
            </a>
          )}

          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
