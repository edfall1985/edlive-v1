"use client";

import { useState, useEffect, useCallback } from "react";

interface MediaItem {
  id: number;
  debate_id: number;
  title: string | null;
  media_type: string;
  url: string;
  description: string | null;
  is_approved: boolean;
  created_at: string;
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    image: "bg-pink-500/10 text-pink-400",
    video: "bg-purple-500/10 text-purple-400",
    pdf: "bg-red-500/10 text-red-400",
    article: "bg-blue-500/10 text-blue-400",
    link: "bg-green-500/10 text-green-400",
    chart: "bg-yellow-500/10 text-yellow-400",
  };
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[type] || "bg-gray-500/10 text-gray-400"}`}>{type.toUpperCase()}</span>;
}

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/api/admin/media";
      if (filter === "pending") url += "?approved=false";
      if (filter === "approved") url += "?approved=true";
      const res = await fetch(url);
      const data = await res.json();
      setMediaItems(data.media || []);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: true }),
      });
      if (res.ok) fetchMedia();
    } catch (err) {
      console.error("Failed to approve media:", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: false }),
      });
      if (res.ok) fetchMedia();
    } catch (err) {
      console.error("Failed to reject media:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus media ini?")) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) fetchMedia();
    } catch (err) {
      console.error("Failed to delete media:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Media Board</h3>
          <p className="text-sm text-gray-500">{mediaItems.length} items</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {["all", "pending", "approved"].map((f) => (
          <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${filter === f ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaItems.map((item) => (
            <div key={item.id} className={`bg-gray-900 border rounded-xl p-5 transition-colors ${!item.is_approved ? "border-yellow-500/30" : "border-gray-800 hover:border-gray-700"}`}>
              <div className="flex items-center justify-between mb-3">
                <TypeBadge type={item.media_type} />
                {!item.is_approved && <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-400 rounded-full">Pending</span>}
              </div>
              <p className="text-sm font-medium text-white mb-2">{item.title || "Untitled"}</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p>Debate: <span className="text-gray-300">#{item.debate_id}</span></p>
                <p>Date: <span className="text-gray-300">{new Date(item.created_at).toLocaleDateString("id-ID")}</span></p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
                {!item.is_approved ? (
                  <>
                    <button onClick={() => handleApprove(item.id)} className="flex-1 px-3 py-1.5 text-xs bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors cursor-pointer">Approve</button>
                    <button onClick={() => handleDelete(item.id)} className="flex-1 px-3 py-1.5 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer">Delete</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleReject(item.id)} className="flex-1 px-3 py-1.5 text-xs bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors cursor-pointer">Unapprove</button>
                    <button onClick={() => handleDelete(item.id)} className="flex-1 px-3 py-1.5 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
          {mediaItems.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-12 text-gray-500">No media items found</div>
          )}
        </div>
      )}
    </div>
  );
}
