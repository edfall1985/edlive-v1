"use client";

import { useState } from "react";

const myComments = [
  { id: 1, debate: "WTO Indonesia", content: "Setuju banget sama argumen pro, data WTO jelas menguntungkan Indonesia dalam jangka panjang", likes: 24, replies: 3, time: "12 min ago", status: "approved" },
  { id: 2, debate: "WTO Indonesia", content: "Sebagai petani, saya merasakan langsung dampak negatif impor dari kebijakan WTO", likes: 42, replies: 7, time: "1 hour ago", status: "approved" },
  { id: 3, debate: "UMKM vs Korporasi", content: "Data menunjukkan UMKM menyumbang 60% PDB tapi dapat akses modal terbatas", likes: 18, replies: 2, time: "3 hours ago", status: "approved" },
  { id: 4, debate: "Energi Terbarukan", content: "Target 23% energi terbarukan 2025 tidak realistis tanpa investasi besar", likes: 12, replies: 1, time: "1 day ago", status: "pending" },
];

export default function DashboardCommentsPage() {
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const filtered = myComments.filter((c) => {
    if (filter === "approved") return c.status === "approved";
    if (filter === "pending") return c.status === "pending";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Komentar Saya</h2>
          <p className="text-sm text-gray-500 mt-1">{myComments.length} komentar, {myComments.filter((c) => c.status === "pending").length} menunggu review</p>
        </div>
        <div className="flex items-center gap-2">
          {["all", "approved", "pending"].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${filter === f ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((comment) => (
          <div key={comment.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-blue-400 font-medium">{comment.debate}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${comment.status === "approved" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                    {comment.status === "approved" ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{comment.content}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    {comment.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                    {comment.replies} replies
                  </span>
                  <span>{comment.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
