export function LiveEmbed() {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="aspect-video bg-black relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            <p className="text-gray-400 text-sm">TikTok Live Embed</p>
            <p className="text-gray-500 text-xs mt-1">Live stream will appear here</p>
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          <span className="text-white text-sm font-medium">12.5K</span>
        </div>
      </div>
    </div>
  );
}
