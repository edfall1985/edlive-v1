"use client";

import { useAuthStore } from "@/stores/auth-store";
import { decodeJwtPayload } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setGuest = useAuthStore((s) => s.setGuest);

  useEffect(() => {
    const token = searchParams.get("token");
    const isLogout = searchParams.get("logout");
    const error = searchParams.get("error");

    if (error) {
      console.error("[Auth-Callback] Error:", error);
      setGuest();
      router.replace("/");
      return;
    }

    if (isLogout === "1") {
      setGuest();
      router.replace("/");
      return;
    }

    if (!token) {
      console.error("[Auth-Callback] No token received");
      setGuest();
      router.replace("/");
      return;
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      console.error("[Auth-Callback] Invalid token");
      setGuest();
      router.replace("/");
      return;
    }

    const user = {
      id: payload.id,
      email: payload.email,
      display_name: payload.name,
      role: payload.role,
      avatar_url: payload.avatar,
    };

    // Set Zustand state immediately
    setAuth(user);

    // Call server to set cookies, then redirect
    fetch("/api/auth/sso-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      credentials: "same-origin",
    })
      .catch(() => {})
      .finally(() => {
        router.replace("/");
      });
  }, [searchParams, setAuth, setGuest, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Memproses login...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
