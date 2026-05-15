"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

function AuthInitializer({ children }: { children: ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setGuest = useAuthStore((s) => s.setGuest);

  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);

      // Handle logout redirect from SSO
      if (params.get("logout") === "1") {
        document.cookie = "edlive_token=; path=/; max-age=0";
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
        setGuest();
        return;
      }

      // Handle SSO token from URL
      const urlToken = params.get("token");
      if (urlToken) {
        try {
          const res = await fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: urlToken }),
          });

          if (res.ok) {
            const data = await res.json();
            setAuth(data.user, urlToken);
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, "", cleanUrl);
            return;
          }
        } catch {
          // fall through to guest
        }
      }

      // Check cookie token
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const tokenCookie = cookies.find((c) => c.startsWith("edlive_token="));
      if (tokenCookie) {
        const cookieToken = tokenCookie.split("=")[1];
        try {
          const res = await fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: cookieToken }),
          });

          if (res.ok) {
            const data = await res.json();
            setAuth(data.user, cookieToken);
            return;
          }
        } catch {
          // fall through to guest
        }
      }

      setGuest();
    };

    init();
  }, [setAuth, setGuest]);

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
