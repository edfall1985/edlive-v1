"use client";

const myVotes = [
  { id: 1, debate: "WTO Indonesia", category: "most_convincing", position: "pro", speaker: "Andi Pratama", time: "5 min ago" },
  { id: 2, debate: "WTO Indonesia", category: "most_logical", position: "pro", speaker: "Sarah Wijaya", time: "12 min ago" },
  { id: 3, debate: "UMKM vs Korporasi", category: "most_data_based", position: "pro", speaker: "Budi Santoso", time: "1 hour ago" },
  { id: 4, debate: "UMKM vs Korporasi", category: "most_convincing", position: "pro", speaker: "Dewi Kartika", time: "1 hour ago" },
  { id: 5, debate: "Energi Terbarukan", category: "most_emotional", position: "kontra", speaker: "Rizky Hakim", time: "2 hours ago" },
];

const voteSummary = {
  pro: 32,
  kontra: 15,
  categories: {
    most_logical: 12,
    most_convincing: 18,
    most_data_based: 8,
    most_emotional: 9,
  },
};

export default function DashboardVotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Vote Saya</h2>
        <p className="text-sm text-gray-500 mt-1">Riwayat dan statistik voting kamu</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Vote</p>
          <p className="text-3xl font-bold text-white mt-2">{voteSummary.pro + voteSummary.kontra}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500">Vote Pro</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{voteSummary.pro}</p>
          <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(voteSummary.pro / (voteSummary.pro + voteSummary.kontra)) * 100}%` }} />
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-500">Vote Kontra</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{voteSummary.kontra}</p>
          <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${(voteSummary.kontra / (voteSummary.pro + voteSummary.kontra)) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Vote Per Kategori</h3>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(voteSummary.categories).map(([key, value]) => {
            const labels: Record<string, string> = {
              most_logical: "Most Logical",
              most_convincing: "Most Convincing",
              most_data_based: "Most Data-Based",
              most_emotional: "Most Emotional",
            };
            const colors: Record<string, string> = {
              most_logical: "text-blue-400",
              most_convincing: "text-green-400",
              most_data_based: "text-purple-400",
              most_emotional: "text-orange-400",
            };
            return (
              <div key={key} className="text-center p-4 bg-gray-800 rounded-lg">
                <p className={`text-2xl font-bold ${colors[key]}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-1">{labels[key]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vote History */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Riwayat Vote</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {myVotes.map((vote) => (
            <div key={vote.id} className="p-5 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{vote.debate}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${vote.position === "pro" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"}`}>
                      {vote.position}
                    </span>
                    <span className="text-xs text-gray-500">{vote.speaker}</span>
                    <span className="text-xs text-gray-600">&middot;</span>
                    <span className="text-xs text-gray-500">{vote.category.replace("_", " ")}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">{vote.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
