"use client";

import { useState } from "react";

const stats = [
  { label: "Total Debates", value: "24", change: "+3", changeType: "up", icon: "debate" },
  { label: "Active Speakers", value: "12", change: "+2", changeType: "up", icon: "speaker" },
  { label: "Total Votes", value: "8,432", change: "+847", changeType: "up", icon: "vote" },
  { label: "Comments", value: "1,284", change: "+156", changeType: "up", icon: "comment" },
  { label: "Media Items", value: "89", change: "+12", changeType: "up", icon: "media" },
  { label: "AI Summaries", value: "36", change: "+5", changeType: "up", icon: "ai" },
];

const liveDebates = [
  { id: 1, title: "Apakah Indonesia Perlu Masuk WTO?", status: "live", session: "education", pro: 52, kontra: 48, viewers: 234, startedAt: "2026-05-16 10:00" },
  { id: 2, title: "Wajib Belajar 12 Tahun Efektif?", status: "scheduled", session: "viewer", pro: 0, kontra: 0, viewers: 0, startedAt: "2026-05-16 14:00" },
  { id: 3, title: "UMKM vs Korporasi: Siapa Menang?", status: "ended", session: "enjoy", pro: 61, kontra: 39, viewers: 0, startedAt: "2026-05-15 19:00" },
];

const recentActivity = [
  { id: 1, type: "vote", message: "New vote cast on WTO debate", time: "2 min ago" },
  { id: 2, type: "comment", message: "Comment flagged for moderation", time: "5 min ago" },
  { id: 3, type: "ai", message: "AI summary generated for debate #3", time: "12 min ago" },
  { id: 4, type: "media", message: "New evidence uploaded by viewer", time: "18 min ago" },
  { id: 5, type: "speaker", message: "Speaker Dewi Kartika started speaking", time: "25 min ago" },
];

function StatIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    debate: "text-blue-400 bg-blue-400/10",
    speaker: "text-purple-400 bg-purple-400/10",
    vote: "text-green-400 bg-green-400/10",
    comment: "text-yellow-400 bg-yellow-400/10",
    media: "text-pink-400 bg-pink-400/10",
    ai: "text-cyan-400 bg-cyan-400/10",
  };
  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[type] || "text-gray-400 bg-gray-400/10"}`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    live: "bg-red-500/10 text-red-400 border-red-500/20",
    scheduled: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    ended: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.ended}`}>
      {status === "live" && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Overview</h3>
          <p className="text-sm text-gray-500">Platform performance at a glance</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          {["24h", "7d", "30d", "90d"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                selectedPeriod === period
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <StatIcon type={stat.icon} />
              <span className={`text-xs font-medium ${stat.changeType === "up" ? "text-green-400" : "text-red-400"}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Debates */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Recent Debates</h4>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Debate</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pro/Kontra</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Viewers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {liveDebates.map((debate) => (
                  <tr key={debate.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white truncate max-w-xs">{debate.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{debate.startedAt}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={debate.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden w-24">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${debate.pro}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{debate.pro}/{debate.kontra}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{debate.viewers > 0 ? debate.viewers : "-"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-800">
            <h4 className="text-sm font-semibold text-white">Recent Activity</h4>
          </div>
          <div className="p-4 space-y-3">
            {recentActivity.map((activity) => {
              const typeColors: Record<string, string> = {
                vote: "bg-green-400",
                comment: "bg-yellow-400",
                ai: "bg-cyan-400",
                media: "bg-pink-400",
                speaker: "bg-purple-400",
              };
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${typeColors[activity.type] || "bg-gray-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{activity.message}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Create Debate", desc: "Start a new debate session", color: "from-blue-500 to-blue-600" },
          { label: "Manage Speakers", desc: "Add or edit speakers", color: "from-purple-500 to-purple-600" },
          { label: "Moderate Comments", desc: "Review flagged comments", color: "from-yellow-500 to-yellow-600" },
          { label: "AI Settings", desc: "Configure AI providers", color: "from-cyan-500 to-cyan-600" },
        ].map((action) => (
          <button
            key={action.label}
            className={`bg-gradient-to-br ${action.color} rounded-xl p-4 text-left hover:opacity-90 transition-opacity cursor-pointer`}
          >
            <p className="text-sm font-semibold text-white">{action.label}</p>
            <p className="text-xs text-white/70 mt-1">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
