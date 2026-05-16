"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

const SSO_URL = process.env.NEXT_PUBLIC_SSO_URL || "http://localhost:4000";
const EDLIVE_URL = typeof window !== "undefined" ? window.location.origin : "http://localhost:4001";

export function Navbar() {
  const { status, user, isAllowed } = useAuthStore();
  const isAuthed = status === "authenticated";
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowLoginDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  const ssoLoginUrl = `${SSO_URL}/login?callbackUrl=${encodeURIComponent(EDLIVE_URL + "/auth/callback")}`;
  const googleLoginUrl = "/auth/google";

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
                {user?.display_name || user?.email?.split("@")[0] || "User"}
              </span>
              <span className="hidden sm:inline text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500 capitalize">
                {user?.role || "user"}
              </span>
              {isAllowed(["owner", "admin"]) && (
                <a
                  href="/admin"
                  className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Admin
                </a>
              )}
              <a
                href="/dashboard"
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Dashboard
              </a>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                </svg>
                Login
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showLoginDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <a
                    href={ssoLoginUrl}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    </svg>
                    <div className="text-left">
                      <div className="font-medium">SSO Login</div>
                      <div className="text-xs text-gray-400">DigTri SSO</div>
                    </div>
                  </a>
                  <div className="border-t border-gray-100 my-1" />
                  <a
                    href={googleLoginUrl}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <div className="text-left">
                      <div className="font-medium">Google</div>
                      <div className="text-xs text-gray-400">Login with Google</div>
                    </div>
                  </a>
                </div>
              )}
            </div>
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
