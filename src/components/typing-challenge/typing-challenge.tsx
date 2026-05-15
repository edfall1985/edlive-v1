"use client";

import { useAuthStore } from "@/stores/auth-store";

export function TypingChallenge() {
  const { isAllowed } = useAuthStore();
  const canParticipate = isAllowed(["owner", "admin", "moderator", "mc", "user"]);

  return (
    <div className={`rounded-xl border-2 p-4 text-center transition-all ${
      canParticipate
        ? "bg-gradient-to-r from-orange-100 to-red-100 border-orange-400"
        : "bg-gray-50 border-gray-200 opacity-60"
    }`}>
      <h4 className="font-bold text-orange-600 mb-2">🔥 TYPING CHALLENGE</h4>
      <p className="text-sm text-gray-600 mb-3">
        {canParticipate
          ? "Spam 🔥 jika setuju dengan PRO!"
          : "Login to join the challenge"}
      </p>
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="text-4xl animate-bounce"
            style={{ animationDelay: `${i * 0.2}s`, animationDuration: "1s" }}
          >
            🔥
          </span>
        ))}
      </div>
    </div>
  );
}
