"use client";

import { useState, useEffect, useCallback } from "react";

interface Speaker {
  id: number;
  debate_id: number;
  display_name: string;
  title: string | null;
  position: string;
  speaking_order: number;
  is_active: boolean;
  avatar_url: string | null;
}

export default function AdminSpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ debate_id: "", display_name: "", title: "", position: "pro" as "pro" | "kontra" });

  const fetchSpeakers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/speakers");
      const data = await res.json();
      setSpeakers(data.speakers || []);
    } catch (err) {
      console.error("Failed to fetch speakers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers]);

  const handleSubmit = async () => {
    if (!formData.debate_id || !formData.display_name) return;
    try {
      const res = await fetch("/api/admin/speakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, debate_id: parseInt(formData.debate_id) }),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ debate_id: "", display_name: "", title: "", position: "pro" });
        fetchSpeakers();
      }
    } catch (err) {
      console.error("Failed to save speaker:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus speaker ini?")) return;
    try {
      const res = await fetch(`/api/admin/speakers/${id}`, { method: "DELETE" });
      if (res.ok) fetchSpeakers();
    } catch (err) {
      console.error("Failed to delete speaker:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Speaker Management</h3>
          <p className="text-sm text-gray-500">{speakers.length} registered speakers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
          + Add Speaker
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {speaker.display_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{speaker.display_name}</p>
                    {speaker.title && <p className="text-xs text-gray-500">{speaker.title}</p>}
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${speaker.position === "pro" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"}`}>
                  {speaker.position}
                </span>
              </div>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Debate ID</span>
                  <span className="text-gray-300">#{speaker.debate_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order</span>
                  <span className="text-gray-300">{speaker.speaking_order}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={speaker.is_active ? "text-green-400" : "text-gray-500"}>{speaker.is_active ? "Active" : "Inactive"}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-end gap-2">
                <button onClick={() => handleDelete(speaker.id)} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Remove</button>
              </div>
            </div>
          ))}
          {speakers.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-12 text-gray-500">No speakers found</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Add Speaker</h4>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input type="text" value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Speaker name..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title / Profession</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="e.g. Ekonom & Peneliti" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Debate ID</label>
                  <input type="number" value={formData.debate_id} onChange={(e) => setFormData({ ...formData, debate_id: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                  <select value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value as "pro" | "kontra" })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                    <option value="pro">Pro</option>
                    <option value="kontra">Kontra</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">Add Speaker</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
