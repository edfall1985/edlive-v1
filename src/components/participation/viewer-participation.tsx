"use client";

import { useAuthStore } from "@/stores/auth-store";

const actions = [
  { label: "Kirim Pertanyaan", color: "blue", icon: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" },
  { label: "Challenge Argumen", color: "orange", icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" },
  { label: "Upload Bukti", color: "green", icon: "M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" },
];

export function ViewerParticipation() {
  const { isAllowed } = useAuthStore();
  const canParticipate = isAllowed(["owner", "admin", "moderator", "mc", "user"]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className="font-bold text-primary mb-3">Partisipasi Viewer</h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.label}
            disabled={!canParticipate}
            className={`w-full p-3 rounded-lg text-left transition-colors ${
              !canParticipate
                ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                : `bg-${action.color}-50 hover:bg-${action.color}-100 text-gray-700 cursor-pointer`
            }`}
            title={!canParticipate ? "Login to participate" : undefined}
          >
            <div className="flex items-center gap-2">
              <svg className={`w-5 h-5 text-${action.color}-500`} fill="currentColor" viewBox="0 0 20 20">
                <path d={action.icon} />
              </svg>
              <span className="text-sm font-medium">{action.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
