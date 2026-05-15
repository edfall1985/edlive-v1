"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LogoutHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    logout();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    router.push(callbackUrl);
  }, [logout, router, searchParams]);

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
