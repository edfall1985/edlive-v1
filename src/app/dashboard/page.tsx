"use client";

import { useAuthStore } from "@/stores/auth-store";

const upcomingDebates = [
  { id: 1, title: "Apakah Indonesia Perlu Masuk WTO?", motion: "Keanggotaan WTO memberikan lebih banyak manfaat", status: "live", session: "education", startTime: "Sedang Berlangsung", pro: 52, kontra: 48, viewers: 234 },
  { id: 2, title: "Wajib Belajar 12 Tahun Efektif?", motion: "Program wajib belajar 12 tahun perlu diperluas", status: "scheduled", session: "viewer", startTime: "Hari ini, 14:00", pro: 0, kontra: 0, viewers: 0 },
  { id: 3, title: "Pajak Digital: Adil atau Memberatkan?", motion: "Pajak untuk platform digital harus dinaikkan", status: "scheduled", session: "education", startTime: "Besok, 19:00", pro: 0, kontra: 0, viewers: 0 },
];

const recentDebates = [
  { id: 4, title: "UMKM vs Korporasi: Siapa Menang?", status: "ended", pro: 61, kontra: 39, totalVotes: 5621, date: "15 Mei 2026" },
  { id: 5, title: "Energi Terbarukan: Realistis atau Utopia?", status: "ended", pro: 45, kontra: 55, totalVotes: 4102, date: "14 Mei 2026" },
];

const myActivity = [
  { id: 1, type: "vote", debate: "WTO Indonesia", detail: "Vote: Pro (Most Convincing)", time: "5 min ago" },
  { id: 2, type: "comment", debate: "WTO Indonesia", detail: "Comment: \"Setuju dengan argumen pro...\"", time: "12 min ago" },
  { id: 3, type: "vote", debate: "UMKM vs Korporasi", detail: "Vote: Pro (Most Logical)", time: "1 hour ago" },
  { id: 4, type: "media", debate: "WTO Indonesia", detail: "Uploaded: Data Ekspor-Impor 2025", time: "2 hours ago" },
  { id: 5, type: "challenge", debate: "WTO Indonesia", detail: "Completed: Typing Challenge", time: "3 hours ago" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    live: "bg-red-500/10 text-red-400 border-red-500/20",
    scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    ended: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.ended}`}>
      {status === "live" && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function DashboardOverviewPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Selamat Datang, {user?.display_name?.split(" ")[0] || user?.email?.split("@")[0]}!
            </h2>
            <p className="text-gray-400 mt-1">Ikuti debat, berikan suara, dan berkontribusi dalam diskusi publik</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full border border-blue-500/20">
              {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Debate Diikuti", value: "12", icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z", color: "text-blue-400" },
          { label: "Total Vote", value: "47", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "text-green-400" },
          { label: "Komentar", value: "23", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "text-yellow-400" },
          { label: "Bookmark", value: "8", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z", color: "text-purple-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-800`}>
                <svg className={`w-5 h-5 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live & Upcoming Debates */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Now */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <h3 className="text-sm font-semibold text-white">Sedang Berlangsung</h3>
              </div>
              <a href="/" className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                Join Now &rarr;
              </a>
            </div>
            <div className="p-5">
              {upcomingDebates.filter((d) => d.status === "live").map((debate) => (
                <div key={debate.id} className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">{debate.title}</h4>
                  <p className="text-sm text-gray-400">{debate.motion}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full capitalize">{debate.session}</span>
                    <span className="text-xs text-gray-500">{debate.viewers} viewers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${debate.pro}%` }} />
                    </div>
                    <span className="text-xs text-blue-400 font-medium">{debate.pro}%</span>
                    <span className="text-xs text-gray-600">vs</span>
                    <span className="text-xs text-red-400 font-medium">{debate.kontra}%</span>
                  </div>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Join Debate
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-white">Debat Mendatang</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {upcomingDebates.filter((d) => d.status === "scheduled").map((debate) => (
                <div key={debate.id} className="p-5 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{debate.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 truncate">{debate.motion}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded-full capitalize">{debate.session}</span>
                        <span className="text-xs text-gray-500">{debate.startTime}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 text-xs bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors cursor-pointer flex-shrink-0">
                      Remind Me
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Debates */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-white">Debat Terakhir</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {recentDebates.map((debate) => (
                <div key={debate.id} className="p-5 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{debate.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <StatusBadge status={debate.status} />
                        <span className="text-xs text-gray-500">{debate.date}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500">{debate.totalVotes.toLocaleString()} votes</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-blue-400">{debate.pro}%</span>
                        <span className="text-xs text-gray-600">-</span>
                        <span className="text-xs text-red-400">{debate.kontra}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* My Activity */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl">
            <div className="px-5 py-4 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-white">Aktivitas Saya</h3>
            </div>
            <div className="p-4 space-y-3">
              {myActivity.map((activity) => {
                const typeColors: Record<string, string> = {
                  vote: "bg-green-400",
                  comment: "bg-yellow-400",
                  media: "bg-pink-400",
                  challenge: "bg-blue-400",
                };
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${typeColors[activity.type] || "bg-gray-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">{activity.detail}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-600">{activity.debate}</span>
                        <span className="text-xs text-gray-700">&middot;</span>
                        <span className="text-xs text-gray-600">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              {[
                { label: "Vote di Debat Aktif", desc: "Berikan suara pro/kontra", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "from-green-500 to-green-600" },
                { label: "Kirim Komentar", desc: "Beri pendapatmu", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "from-yellow-500 to-yellow-600" },
                { label: "Upload Bukti", desc: "Tambahkan data/referensi", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", color: "from-purple-500 to-purple-600" },
                { label: "Typing Challenge", desc: "Ikuti challenge typing", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color: "from-blue-500 to-blue-600" },
              ].map((action) => (
                <button
                  key={action.label}
                  className={`w-full bg-gradient-to-r ${action.color} rounded-lg p-3 text-left hover:opacity-90 transition-opacity cursor-pointer`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-white">{action.label}</p>
                      <p className="text-xs text-white/70">{action.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl">
            <div className="px-5 py-4 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-white">Top Contributors</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { rank: 1, name: "Ahmad Fauzi", points: 1250, avatar: "AF" },
                { rank: 2, name: "Siti Nurhaliza", points: 980, avatar: "SN" },
                { rank: 3, name: "Reza Rahadian", points: 875, avatar: "RR" },
                { rank: 4, name: "Dian Sastro", points: 720, avatar: "DS" },
              ].map((user) => (
                <div key={user.rank} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    user.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                    user.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                    user.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                    "bg-gray-700 text-gray-400"
                  }`}>
                    {user.rank}
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  </div>
                  <span className="text-xs text-gray-500">{user.points.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
