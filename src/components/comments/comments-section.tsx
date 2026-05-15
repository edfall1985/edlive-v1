"use client";

import { useCommentStore } from "@/stores/comment-store";
import { useAuthStore } from "@/stores/auth-store";
import { usePolling } from "@/hooks/use-polling";
import { useState, useEffect } from "react";

import type { Comment } from "@/types";

const MOCK_COMMENTS: Comment[] = [
  { id: 1, debate_id: 1, user_id: null, display_name: "@asep_jaya", content: "WTO itu harusnya memperlakukan negara berkembang dengan lebih adil!", likes_count: 234, is_highlighted: false, created_at: new Date().toISOString() },
  { id: 2, debate_id: 1, user_id: null, display_name: "@maria_ekonomi", content: "Sekarang kita lihat datanya... Indonesia justru rugi di WTO!", likes_count: 189, is_highlighted: false, created_at: new Date().toISOString() },
  { id: 3, debate_id: 1, user_id: null, display_name: "@budi_petra", content: "Harus keluar dari WTO! Indonesia bisa berdiri sendiri!", likes_count: 156, is_highlighted: false, created_at: new Date().toISOString() },
  { id: 4, debate_id: 1, user_id: null, display_name: "@dwi_analyst", content: "Kedua belah pihak harus menggunakan data yang valid!", likes_count: 98, is_highlighted: false, created_at: new Date().toISOString() },
];

export function CommentsSection() {
  const { comments, setComments, addComment } = useCommentStore();
  const { isAllowed } = useAuthStore();
  const canComment = isAllowed(["owner", "admin", "moderator", "mc", "user"]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setComments(MOCK_COMMENTS);
  }, [setComments]);

  usePolling(() => {
    // In Phase 2: fetch new comments from API
  }, 3000, false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addComment({
      id: Date.now(),
      debate_id: 1,
      user_id: null,
      display_name: "@guest",
      content: input.trim(),
      likes_count: 0,
      is_highlighted: false,
      created_at: new Date().toISOString(),
    });
    setInput("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-primary flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          Komentar Live
        </h3>
        <span className="text-xs text-secondary">🔥 2.5K komentar</span>
      </div>

      <div className="h-64 overflow-y-auto space-y-2 mb-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-2 rounded-lg bg-gray-50 border-l-4 border-gray-200"
          >
            <p className="text-sm">{comment.content}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{comment.display_name}</span>
              <span className="text-xs text-orange-500">🔥 {comment.likes_count}</span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={canComment ? "Tulis komentar..." : "Login to comment"}
          disabled={!canComment}
          className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!canComment || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
