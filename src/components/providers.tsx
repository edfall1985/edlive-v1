"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

function AuthInitializer({ children }: { children: ReactNode }) {
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const setGuest = useAuthStore((s) => s.setGuest);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const params = new URLSearchParams(window.location.search);

    // Handle logout redirect
    if (params.get("logged_out") === "1") {
      const cleanUrl = window.location.origin + "/";
      window.history.replaceState({}, "", cleanUrl);
      setGuest();
      return;
    }

    // Handle logout redirect from SSO
    if (params.get("logout") === "1") {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
      setGuest();
      return;
    }

    // Fetch session from API
    fetchSession();
  }, [fetchSession, setGuest]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2000,
            refetchInterval: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>{children}</AuthInitializer>
    </QueryClientProvider>
  );
}
