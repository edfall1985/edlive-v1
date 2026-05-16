"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setResetUrl("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset link");
        return;
      }

      setSuccess(true);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-400 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Reset Password</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset link</p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm text-green-400 text-center">Reset link has been sent to your email</p>
              </div>
              {resetUrl && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Dev mode - reset URL:</p>
                  <a href={resetUrl} className="text-xs text-blue-400 break-all hover:underline">{resetUrl}</a>
                </div>
              )}
              <Link href="/" className="block text-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <Link href="/" className="block text-center text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Back to Home
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
