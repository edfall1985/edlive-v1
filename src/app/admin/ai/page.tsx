"use client";

const aiSummaries = [
  { id: 1, type: "summary", debate: "WTO Indonesia", content: "Debat membahas pro-kontra keanggotaan WTO. Tim pro menekankan manfaat akses pasar global, tim kontra menyoroti dampak pada petani lokal.", provider: "gemini", createdAt: "2026-05-16 10:30" },
  { id: 2, type: "fallacy", debate: "WTO Indonesia", content: "Ad Hominem detected: Serangan personal terhadap pembicara kontra pada menit ke-15. Strawman detected: Argumen pro disederhanakan secara berlebihan.", provider: "gemini", createdAt: "2026-05-16 10:45" },
  { id: 3, type: "insight", debate: "UMKM vs Korporasi", content: "Pola menarik: 61% audience mendukung UMKM, namun data menunjukkan korporasi menyumbang 70% PDB.", provider: "gemini", createdAt: "2026-05-15 20:15" },
  { id: 4, type: "knowledge", debate: "Energi Terbarukan", content: "Timeline: Target 23% energi terbarukan 2025, realisasi 12%. Gap signifikan antara target dan implementasi.", provider: "gemini", createdAt: "2026-05-14 21:00" },
];

export default function AdminAiPage() {
  const typeColors: Record<string, string> = {
    summary: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    fallacy: "bg-red-500/10 text-red-400 border-red-500/20",
    insight: "bg-green-500/10 text-green-400 border-green-500/20",
    knowledge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">AI Summaries</h3>
          <p className="text-sm text-gray-500">AI-generated analysis and insights</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
          Generate New Summary
        </button>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Summaries", count: 36, color: "text-blue-400" },
          { label: "Fallacies Found", count: 14, color: "text-red-400" },
          { label: "Insights", count: 22, color: "text-green-400" },
          { label: "Knowledge", count: 18, color: "text-purple-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Summaries List */}
      <div className="space-y-3">
        {aiSummaries.map((summary) => (
          <div key={summary.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${typeColors[summary.type]}`}>
                  {summary.type.charAt(0).toUpperCase() + summary.type.slice(1)}
                </span>
                <span className="text-xs text-gray-500">{summary.debate}</span>
              </div>
              <span className="text-xs text-gray-600">{summary.createdAt}</span>
            </div>
            <p className="text-sm text-gray-300">{summary.content}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-600">Provider: {summary.provider}</span>
              <div className="flex items-center gap-2">
                <button className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">View Full</button>
                <span className="text-gray-700">|</span>
                <button className="text-xs text-gray-400 hover:text-gray-300 cursor-pointer">Regenerate</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
