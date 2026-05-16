import { create } from "zustand";
import type { User } from "@/types";

const SSO_URL = process.env.NEXT_PUBLIC_SSO_URL || "http://localhost:4000";
const EDLIVE_URL = typeof window !== "undefined" ? window.location.origin : "http://localhost:4001";

interface AuthState {
  status: "loading" | "authenticated" | "guest";
  user: User | null;
  setAuth: (user: User) => void;
  setGuest: () => void;
  setLoading: () => void;
  logout: () => void;
  fetchSession: () => Promise<void>;
  isAllowed: (allowedRoles: readonly string[]) => boolean;
}

function clearClientCookies() {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:";
  document.cookie = `edlive_user=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure ? "; Secure" : ""}`;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "loading",
  user: null,

  setAuth: (user) => set({ status: "authenticated", user }),

  setGuest: () => set({ status: "guest", user: null }),

  setLoading: () => set({ status: "loading" }),

  logout: () => {
    set({ status: "guest", user: null });
    clearClientCookies();

    // Redirect to SSO server logout to terminate SSO session.
    // SSO server should clear its own cookies, then redirect back to edLive.
    const ssoLogoutUrl = `${SSO_URL}/logout?callbackUrl=${encodeURIComponent(EDLIVE_URL + "/auth/callback?logout=1")}`;
    window.location.href = ssoLogoutUrl;
  },

  fetchSession: async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();

      if (data.authenticated && data.user) {
        set({ status: "authenticated", user: data.user });
      } else {
        set({ status: "guest", user: null });
      }
    } catch {
      set({ status: "guest", user: null });
    }
  },

  isAllowed: (allowedRoles) => {
    const state = get();
    const role = state.user?.role || "guest";
    return allowedRoles.includes(role);
  },
}));
