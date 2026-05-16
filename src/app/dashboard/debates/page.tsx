"use client";

const myDebates = [
  { id: 1, title: "Apakah Indonesia Perlu Masuk WTO?", role: "viewer", position: "pro", votes: 3, comments: 5, status: "live", date: "16 Mei 2026" },
  { id: 2, title: "UMKM vs Korporasi: Siapa Menang?", role: "viewer", position: "pro", votes: 2, comments: 3, status: "ended", date: "15 Mei 2026" },
  { id: 3, title: "Energi Terbarukan: Realistis atau Utopia?", role: "viewer", position: "kontra", votes: 1, comments: 2, status: "ended", date: "14 Mei 2026" },
  { id: 4, title: "Pajak Digital: Adil atau Memberatkan?", role: "viewer", position: null, votes: 0, comments: 0, status: "scheduled", date: "17 Mei 2026" },
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

export default function DashboardDebatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Debat Saya</h2>
        <p className="text-sm text-gray-500 mt-1">Riwayat debat yang kamu ikuti</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Diikuti", value: "12", color: "text-blue-400" },
          { label: "Sedang Live", value: "1", color: "text-red-400" },
          { label: "Vote Diberikan", value: "47", color: "text-green-400" },
          { label: "Komentar", value: "23", color: "text-yellow-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Semua Debat</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {myDebates.map((debate) => (
            <div key={debate.id} className="p-5 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-medium text-white">{debate.title}</h4>
                    <StatusBadge status={debate.status} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{debate.date}</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      {debate.votes} votes
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      {debate.comments} comments
                    </span>
                    {debate.position && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${debate.position === "pro" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"}`}>
                        {debate.position}
                      </span>
                    )}
                  </div>
                </div>
                {debate.status === "live" && (
                  <a href="/" className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer">
                    Join
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
