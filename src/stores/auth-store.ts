import { create } from "zustand";
import type { User, Role } from "@/types";

interface AuthState {
  status: "loading" | "authenticated" | "guest";
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  setGuest: () => void;
  setLoading: () => void;
  logout: () => void;
  isAllowed: (allowedRoles: readonly string[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "loading",
  user: null,
  token: null,

  setAuth: (user, token) => {
    if (typeof document !== "undefined") {
      document.cookie = `edlive_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    }
    set({ status: "authenticated", user, token });
  },

  setGuest: () => {
    set({ status: "guest", user: null, token: null });
  },

  setLoading: () => {
    set({ status: "loading" });
  },

  logout: () => {
    if (typeof document !== "undefined") {
      document.cookie = "edlive_token=; path=/; max-age=0";
    }
    set({ status: "guest", user: null, token: null });
  },

  isAllowed: (allowedRoles) => {
    const state = get();
    const role = state.user?.role || "guest";
    return allowedRoles.includes(role);
  },
}));
