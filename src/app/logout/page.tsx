"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LogoutHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isFromSso = searchParams.get("logout") === "1";

    if (isFromSso) {
      // SSO already cleared its session. Clear edLive cookies and redirect to home as guest.
      fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" })
        .catch(() => {})
        .finally(() => {
          clearAllCookies();
          window.location.href = "/";
        });
      return;
    }

    // Initial logout request - redirect to SSO to terminate SSO session
    const SSO_URL = process.env.NEXT_PUBLIC_SSO_URL || "http://localhost:4000";
    const ssoLogoutUrl = `${SSO_URL}/logout?callbackUrl=${encodeURIComponent(window.location.origin + "/logout?logout=1")}`;
    window.location.href = ssoLogoutUrl;
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Logging out...</p>
      </div>
    </div>
  );
}

export default function LogoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    }>
      <LogoutHandler />
    </Suspense>
  );
}
