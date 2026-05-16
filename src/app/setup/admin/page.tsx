"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SetupAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/setup/admin")
      .then((res) => res.json())
      .then((data) => {
        setHasAdmin(data.hasAdmin);
        if (data.hasAdmin) {
          setMessage({ type: "info", text: "Admin user already exists. Redirecting to login..." });
          setTimeout(() => router.push("/"), 3000);
        }
      })
      .catch(() => {
        setMessage({ type: "error", text: "Failed to check admin status" });
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: "error", text: "Email and password are required" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/setup/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, display_name: displayName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to create admin" });
        return;
      }

      setMessage({ type: "success", text: data.message + " Redirecting to login..." });
      setTimeout(() => router.push("/"), 3000);
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setLoading(false);
    }
  };

  if (hasAdmin === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400">{message?.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Setup Admin Pertama</h1>
            <p className="text-sm text-gray-500 mt-1">Buat akun owner untuk mengelola platform</p>
          </div>

          {message && (
            <div className={`rounded-lg p-3 text-sm mb-4 ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="admin@edlive.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="Admin EdLive"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="Min. 6 karakter"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Membuat..." : "Buat Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
