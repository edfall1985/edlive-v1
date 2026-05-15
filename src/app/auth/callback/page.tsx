"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setGuest = useAuthStore((s) => s.setGuest);

  useEffect(() => {
    const token = searchParams.get("token");
    const logout = searchParams.get("logout");

    if (logout === "1") {
      setGuest();
      router.push("/");
      return;
    }

    if (!token) {
      setGuest();
      router.push("/");
      return;
    }

    // Set token in cookie and auth store
    document.cookie = `edlive_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;

    // Decode token client-side to get user info
    try {
      const parts = token.split(".");
      const payload = JSON.parse(atob(parts[1]));
      
      setAuth(
        {
          id: payload.id,
          email: payload.email,
          display_name: payload.name,
          role: payload.role,
          avatar_url: payload.avatar,
        },
        token,
      );

      // Redirect to home
      router.push("/");
    } catch {
      setGuest();
      router.push("/");
    }
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
