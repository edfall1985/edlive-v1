"use client";

const bookmarks = [
  { id: 1, title: "Apakah Indonesia Perlu Masuk WTO?", type: "debate", savedAt: "16 Mei 2026", status: "live" },
  { id: 2, title: "Data Ekspor-Impor Indonesia 2025", type: "media", savedAt: "16 Mei 2026", mediaType: "chart" },
  { id: 3, title: "AI Summary: WTO Indonesia", type: "ai", savedAt: "15 Mei 2026", aiType: "summary" },
  { id: 4, title: "UMKM vs Korporasi: Siapa Menang?", type: "debate", savedAt: "15 Mei 2026", status: "ended" },
  { id: 5, title: "Video Dampak WTO terhadap Petani", type: "media", savedAt: "14 Mei 2026", mediaType: "video" },
  { id: 6, title: "Fallacy Report: WTO Debate", type: "ai", savedAt: "14 Mei 2026", aiType: "fallacy" },
];

export default function DashboardBookmarksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Bookmark Saya</h2>
        <p className="text-sm text-gray-500 mt-1">{bookmarks.length} item tersimpan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map((bookmark) => {
          const typeColors: Record<string, string> = {
            debate: "from-blue-500/20 to-blue-600/10 border-blue-500/20",
            media: "from-purple-500/20 to-purple-600/10 border-purple-500/20",
            ai: "from-green-500/20 to-green-600/10 border-green-500/20",
          };
          const typeLabels: Record<string, string> = {
            debate: "Debate",
            media: "Media",
            ai: "AI Summary",
          };
          return (
            <div key={bookmark.id} className={`bg-gradient-to-br ${typeColors[bookmark.type]} border rounded-xl p-5 hover:opacity-80 transition-opacity cursor-pointer`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">{typeLabels[bookmark.type]}</span>
                <button className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                </button>
              </div>
              <h4 className="text-sm font-medium text-white mb-2">{bookmark.title}</h4>
              <p className="text-xs text-gray-500">{bookmark.savedAt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
