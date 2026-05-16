"use client";

const voteStats = {
  total: 18155,
  pro: 9842,
  kontra: 8313,
  categories: {
    most_logical: 4231,
    most_convincing: 5102,
    most_data_based: 3892,
    most_emotional: 4930,
  },
};

const debateVotes = [
  { id: 1, title: "WTO Indonesia", pro: 52, kontra: 48, total: 8432 },
  { id: 2, title: "UMKM vs Korporasi", pro: 61, kontra: 39, total: 5621 },
  { id: 3, title: "Energi Terbarukan", pro: 45, kontra: 55, total: 4102 },
];

export default function AdminVotesPage() {
  const proPercent = (voteStats.pro / voteStats.total) * 100;
  const kontraPercent = (voteStats.kontra / voteStats.total) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Vote Analytics</h3>
        <p className="text-sm text-gray-500">Real-time voting statistics</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-500">Total Votes</p>
          <p className="text-3xl font-bold text-white mt-2">{voteStats.total.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-500">Pro Votes</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{voteStats.pro.toLocaleString()}</p>
          <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${proPercent}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{proPercent.toFixed(1)}%</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-500">Kontra Votes</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{voteStats.kontra.toLocaleString()}</p>
          <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${kontraPercent}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{kontraPercent.toFixed(1)}%</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-800">
          <h4 className="text-sm font-semibold text-white">Vote Categories</h4>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(voteStats.categories).map(([key, value]) => {
              const labels: Record<string, string> = {
                most_logical: "Most Logical",
                most_convincing: "Most Convincing",
                most_data_based: "Most Data-Based",
                most_emotional: "Most Emotional",
              };
              const colors: Record<string, string> = {
                most_logical: "from-blue-500 to-blue-600",
                most_convincing: "from-green-500 to-green-600",
                most_data_based: "from-purple-500 to-purple-600",
                most_emotional: "from-orange-500 to-orange-600",
              };
              const percent = ((value / voteStats.total) * 100).toFixed(1);
              return (
                <div key={key} className="bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">{labels[key]}</p>
                  <p className="text-xl font-bold text-white">{value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{percent}% of total</p>
                  <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${colors[key]} rounded-full`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Per Debate */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-800">
          <h4 className="text-sm font-semibold text-white">Votes Per Debate</h4>
        </div>
        <div className="p-6 space-y-4">
          {debateVotes.map((debate) => (
            <div key={debate.id} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{debate.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${debate.pro}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-400 font-medium">{debate.pro}%</span>
                <span className="text-gray-600">/</span>
                <span className="text-red-400 font-medium">{debate.kontra}%</span>
                <span className="text-gray-500 w-20 text-right">{debate.total.toLocaleString()} votes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
