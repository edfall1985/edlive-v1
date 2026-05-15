"use client";

import { useAuthStore } from "@/stores/auth-store";

export function MediaBoard() {
  const { isAllowed } = useAuthStore();
  const canUpload = isAllowed(["owner", "admin", "moderator", "mc", "user"]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-primary flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          Media Board
        </h3>
        {canUpload && (
          <button className="text-xs text-blue-600 hover:underline">+ Tambah</button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["Grafik", "PDF", "Artikel", "Data"].map((item, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all text-xs text-gray-500 border"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
