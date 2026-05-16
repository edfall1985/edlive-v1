"use client";

import { useState, useEffect, useCallback } from "react";

interface User {
  id: number;
  email: string;
  display_name: string | null;
  role: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: "", display_name: "", role: "user" });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async () => {
    if (!formData.email || !formData.role) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ email: "", display_name: "", role: "user" });
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus user ini?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">User Management</h3>
          <p className="text-sm text-gray-500">{users.length} registered users</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
          + Add User
        </button>
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
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {user.display_name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.display_name || user.email}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "owner" ? "bg-purple-500/10 text-purple-400" :
                        user.role === "admin" ? "bg-blue-500/10 text-blue-400" :
                        user.role === "moderator" ? "bg-green-500/10 text-green-400" :
                        user.role === "mc" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-gray-500/10 text-gray-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${user.is_active ? "text-green-400" : "text-gray-500"}`}>
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString("id-ID")}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleActive(user)} className={`text-xs ${user.is_active ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"} cursor-pointer`}>
                          {user.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <span className="text-gray-700">|</span>
                        <button onClick={() => handleDelete(user.id)} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No users found</td>
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
              <h4 className="text-lg font-semibold text-white">Add User</h4>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="user@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
                <input type="text" value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" placeholder="Full name..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="user">User</option>
                  <option value="mc">MC</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
