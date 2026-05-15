export function AiSummaryPanel() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
          AI SUMMARY
        </span>
        <span className="text-xs text-gray-500">Ringkasan real-time oleh AI</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 font-bold text-sm w-16 flex-shrink-0">PRO:</span>
          <p className="text-sm text-secondary">
            Argumen fokus pada manfaat akses pasar global, investasi asing, dan peningkatan ekspor. Data menunjukkan pertumbuhan ekonomi 4.5% dapat dicapai.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-red-600 font-bold text-sm w-16 flex-shrink-0">KONTRA:</span>
          <p className="text-sm text-secondary">
            Fokus pada ketimpangan regulasi, ancaman terhadap industri kecil, dan ketidakadilan perdagangan dengan negara maju.
          </p>
        </div>
        <div className="pt-2 border-t border-purple-200">
          <span className="text-xs font-bold text-purple-600">⚠️ LOGICAL FALLACY DETECTED:</span>
          <p className="text-sm text-secondary mt-1">
            Budi Santoso menggunakan <span className="font-medium text-red-500">False Dilemma</span> pada argumen menit 12:30
          </p>
        </div>
      </div>
    </div>
  );
}
