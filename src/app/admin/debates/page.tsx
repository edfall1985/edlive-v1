"use client";

import { useState, useEffect, useCallback } from "react";

interface Debate {
  id: number;
  title: string;
  motion: string | null;
  description: string | null;
  status: string;
  session_type: string;
  current_phase: string;
  tiktok_live_url: string | null;
  created_at: string;
}

export default function AdminDebatesPage() {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingDebate, setEditingDebate] = useState<Debate | null>(null);
  const [formData, setFormData] = useState({ title: "", motion: "", session_type: "education", status: "scheduled" });

  const fetchDebates = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/admin/debates" : `/api/admin/debates?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setDebates(data.debates || []);
    } catch (err) {
      console.error("Failed to fetch debates:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchDebates();
  }, [fetchDebates]);

  const handleSubmit = async () => {
    try {
      if (editingDebate) {
        const res = await fetch(`/api/admin/debates/${editingDebate.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setShowModal(false);
          setEditingDebate(null);
          setFormData({ title: "", motion: "", session_type: "education", status: "scheduled" });
          fetchDebates();
        }
      } else {
        const res = await fetch("/api/admin/debates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setShowModal(false);
          setFormData({ title: "", motion: "", session_type: "education", status: "scheduled" });
          fetchDebates();
        }
      }
    } catch (err) {
      console.error("Failed to save debate:", err);
    }
  };

  const handleEdit = (debate: Debate) => {
    setEditingDebate(debate);
    setFormData({
      title: debate.title,
      motion: debate.motion || "",
      session_type: debate.session_type,
      status: debate.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus debat ini?")) return;
    try {
      const res = await fetch(`/api/admin/debates/${id}`, { method: "DELETE" });
      if (res.ok) fetchDebates();
    } catch (err) {
      console.error("Failed to delete debate:", err);
    }
  };

  const openCreate = () => {
    setEditingDebate(null);
    setFormData({ title: "", motion: "", session_type: "education", status: "scheduled" });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Debate Management</h3>
          <p className="text-sm text-gray-500">{debates.length} total debates</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
          + New Debate
        </button>
      </div>

      <div className="flex items-center gap-2">
        {["all", "live", "scheduled", "ended", "paused"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${filter === f ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Debate</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {debates.map((debate) => (
                  <tr key={debate.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm font-medium text-white truncate">{debate.title}</p>
                      {debate.motion && <p className="text-xs text-gray-500 truncate mt-0.5">{debate.motion}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
                        debate.status === "live" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        debate.status === "scheduled" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                        "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      }`}>
                        {debate.status === "live" && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />}
                        {debate.status.charAt(0).toUpperCase() + debate.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm text-gray-400 capitalize">{debate.session_type}</span></td>
                    <td className="px-6 py-4"><span className="text-sm text-gray-500">{new Date(debate.created_at).toLocaleDateString("id-ID")}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(debate)} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">Edit</button>
                        <span className="text-gray-700">|</span>
                        <button onClick={() => handleDelete(debate.id)} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {debates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No debates found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">{editingDebate ? "Edit Debate" : "Create New Debate"}</h4>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Debate title..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Motion</label>
                <textarea value={formData.motion} onChange={(e) => setFormData({ ...formData, motion: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" rows={3} placeholder="Debate motion..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Session Type</label>
                  <select value={formData.session_type} onChange={(e) => setFormData({ ...formData, session_type: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                    <option value="viewer">Viewer</option>
                    <option value="education">Education</option>
                    <option value="enjoy">Enjoy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="paused">Paused</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                {editingDebate ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
