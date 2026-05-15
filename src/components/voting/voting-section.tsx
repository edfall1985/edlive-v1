"use client";

import { useDebateStore } from "@/stores/debate-store";
import { useAuthStore } from "@/stores/auth-store";

export function VotingSection() {
  const voteStats = useDebateStore((s) => s.voteStats);
  const { status, isAllowed } = useAuthStore();
  const canVote = isAllowed(["owner", "admin", "moderator", "mc", "user"]);

  if (!voteStats) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-primary">Voting Publik</h3>
        <span className="text-xs text-secondary">Total: {voteStats.total.toLocaleString()} votes</span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center gap-1 text-blue-600 font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              PRO
            </span>
            <span className="text-blue-600 font-bold">{voteStats.pro}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${voteStats.pro}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              KONTRA
            </span>
            <span className="text-red-600 font-bold">{voteStats.kontra}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-500"
              style={{ width: `${voteStats.kontra}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <VoteButton type="pro" disabled={!canVote} />
        <VoteButton type="kontra" disabled={!canVote} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-100">
        {Object.entries(voteStats.categories).map(([key, val]) => (
          <div key={key} className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{val}%</div>
            <div className="text-xs text-secondary">
              {key === "most_logical" && "Paling Logis"}
              {key === "most_convincing" && "Paling Meyakinkan"}
              {key === "most_data_based" && "Paling Berbasis Data"}
              {key === "most_emotional" && "Paling Emosional"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VoteButton({ type, disabled }: { type: "pro" | "kontra"; disabled: boolean }) {
  const { status } = useAuthStore();
  const isPro = type === "pro";

  return (
    <button
      disabled={disabled}
      title={!disabled ? undefined : "Login with Google to vote"}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
        isPro
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-red-500 text-white hover:bg-red-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d={isPro
          ? "M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
          : "M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
        } clipRule="evenodd" />
      </svg>
      Vote {type.toUpperCase()}
    </button>
  );
}
