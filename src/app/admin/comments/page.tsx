"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: number;
  debate_id: number;
  display_name: string | null;
  content: string;
  is_moderated: boolean;
  is_highlighted: boolean;
  likes_count: number;
  created_at: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "flagged">("all");

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "flagged" ? "/api/admin/comments?flagged=true" : "/api/admin/comments";
      const res = await fetch(url);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_moderated: false }),
      });
      if (res.ok) fetchComments();
    } catch (err) {
      console.error("Failed to approve comment:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus komentar ini?")) return;
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      if (res.ok) fetchComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleFlag = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_moderated: true }),
      });
      if (res.ok) fetchComments();
    } catch (err) {
      console.error("Failed to flag comment:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Comment Moderation</h3>
          <p className="text-sm text-gray-500">{comments.length} comments</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilter("all")} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>All</button>
          <button onClick={() => setFilter("flagged")} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${filter === "flagged" ? "bg-red-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>Flagged</button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className={`bg-gray-900 border rounded-xl p-5 transition-colors ${comment.is_moderated ? "border-red-500/30" : "border-gray-800 hover:border-gray-700"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {comment.display_name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{comment.display_name || "Anonymous"}</p>
                      {comment.is_moderated && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-full">Flagged</span>
                      )}
                      {comment.is_highlighted && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-400 rounded-full">Highlighted</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Debate #{comment.debate_id}</span>
                      <span>{new Date(comment.created_at).toLocaleString("id-ID")}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        {comment.likes_count}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {comment.is_moderated ? (
                    <>
                      <button onClick={() => handleApprove(comment.id)} className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors cursor-pointer">Approve</button>
                      <button onClick={() => handleDelete(comment.id)} className="px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors cursor-pointer">Delete</button>
                    </>
                  ) : (
                    <button onClick={() => handleFlag(comment.id)} className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-400 rounded hover:bg-yellow-500/20 transition-colors cursor-pointer">Flag</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="flex items-center justify-center py-12 text-gray-500">No comments found</div>
          )}
        </div>
      )}
    </div>
  );
}
