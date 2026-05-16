"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  checks: { label: string; passed: boolean }[];
}

function checkPasswordStrength(password: string): PasswordStrength {
  const checks = [
    { label: "Minimal 6 karakter", passed: password.length >= 6 },
    { label: "Huruf besar (A-Z)", passed: /[A-Z]/.test(password) },
    { label: "Huruf kecil (a-z)", passed: /[a-z]/.test(password) },
    { label: "Angka (0-9)", passed: /[0-9]/.test(password) },
    { label: "Simbol (!@#$%...)", passed: /[^A-Za-z0-9]/.test(password) },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.min(passedCount, 5);

  if (score <= 1) return { score, label: "Sangat Lemah", color: "bg-red-500", checks };
  if (score === 2) return { score, label: "Lemah", color: "bg-orange-500", checks };
  if (score === 3) return { score, label: "Sedang", color: "bg-yellow-500", checks };
  if (score === 4) return { score, label: "Kuat", color: "bg-green-500", checks };
  return { score, label: "Sangat Kuat", color: "bg-emerald-500", checks };
}

export default function DashboardSettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"password" | "notifications" | "privacy">("password");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Pengaturan</h2>
        <p className="text-sm text-gray-500 mt-1">Kelola keamanan dan preferensi akun kamu</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 w-fit">
        {[
          { id: "password" as const, label: "Password" },
          { id: "notifications" as const, label: "Notifikasi" },
          { id: "privacy" as const, label: "Privasi" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "password" && <PasswordSection />}
      {activeTab === "notifications" && <NotificationsSection />}
      {activeTab === "privacy" && <PrivacySection />}
    </div>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setHasPassword(data.user?.has_password ?? false);
      })
      .catch(() => setHasPassword(false));
  }, []);

  const strength = checkPasswordStrength(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Password tidak cocok" });
      setLoading(false);
      return;
    }

    if (strength.score < 2) {
      setMessage({ type: "error", text: "Password terlalu lemah" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword || undefined,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Gagal mengubah password" });
        return;
      }

      setMessage({ type: "success", text: "Password berhasil diatur" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    } finally {
      setLoading(false);
    }
  };

  if (hasPassword === null) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Keamanan Akun</h3>
            <p className="text-sm text-gray-400 mt-1">
              {hasPassword
                ? "Kamu sudah memiliki password. Masukkan password saat ini untuk mengubahnya."
                : "Kamu belum memiliki password. Buat password untuk login langsung (tanpa SSO)."}
            </p>
          </div>
        </div>
      </div>

      {/* Password Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div className={`rounded-lg p-4 text-sm flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {message.type === "success" ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            {message.text}
          </div>
        )}

        {/* Current Password */}
        {hasPassword && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                placeholder="Masukkan password saat ini"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
              >
                {showCurrent ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Password Baru</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              placeholder="Min. 6 karakter"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
            >
              {showNew ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>

          {/* Strength Indicator */}
          {newPassword.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Kekuatan Password</span>
                <span className={`text-xs font-medium ${strength.score <= 1 ? "text-red-400" : strength.score === 2 ? "text-orange-400" : strength.score === 3 ? "text-yellow-400" : "text-green-400"}`}>
                  {strength.label}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i <= strength.score ? strength.color : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {strength.checks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${check.passed ? "bg-green-500/20" : "bg-gray-700"}`}>
                      {check.passed ? (
                        <svg className="w-2.5 h-2.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                      )}
                    </div>
                    <span className={`text-xs ${check.passed ? "text-green-400" : "text-gray-500"}`}>{check.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Konfirmasi Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full bg-gray-800 border rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${
                passwordsMatch
                  ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/20"
                  : passwordsMismatch
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
              placeholder="Ulangi password baru"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {passwordsMatch && (
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {passwordsMismatch && (
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
            </div>
          </div>
          {passwordsMismatch && (
            <p className="text-xs text-red-400 mt-1.5">Password tidak cocok</p>
          )}
          {passwordsMatch && (
            <p className="text-xs text-green-400 mt-1.5">Password cocok</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <a href="/auth/reset-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
            Lupa password?
          </a>
          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword || strength.score < 2}
            className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Menyimpan...
              </span>
            ) : hasPassword ? "Ubah Password" : "Buat Password"}
          </button>
        </div>
      </form>

      {/* Recent Sessions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Sesi Aktif</h3>
          <p className="text-xs text-gray-500 mt-0.5">Perangkat yang sedang login ke akun kamu</p>
        </div>
        <div className="p-5 space-y-4">
          {[
            { device: "Chrome on Windows", location: "Jakarta, Indonesia", current: true, lastActive: "Sekarang" },
            { device: "Safari on iPhone", location: "Jakarta, Indonesia", current: false, lastActive: "2 jam lalu" },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${session.current ? "bg-blue-500/10" : "bg-gray-800"}`}>
                  <svg className={`w-5 h-5 ${session.current ? "text-blue-400" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{session.device}</p>
                  <p className="text-xs text-gray-500">{session.location} &middot; {session.lastActive}</p>
                </div>
              </div>
              {session.current && (
                <span className="px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">Aktif</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [settings, setSettings] = useState({
    emailDebate: true,
    emailVote: false,
    emailComment: true,
    pushDebate: true,
    pushVote: false,
    pushComment: false,
  });

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${checked ? "bg-blue-500" : "bg-gray-700"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Notifikasi Email</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {[
            { key: "emailDebate", label: "Debat baru dimulai", desc: "Dapatkan email saat debat yang kamu ikuti dimulai" },
            { key: "emailVote", label: "Hasil voting", desc: "Dapatkan email saat voting selesai" },
            { key: "emailComment", label: "Balasan komentar", desc: "Dapatkan email saat ada yang membalas komentarmu" },
          ].map((item) => (
            <div key={item.key} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle checked={settings[item.key as keyof typeof settings]} onChange={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Notifikasi Push</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {[
            { key: "pushDebate", label: "Debat live", desc: "Notifikasi saat debat sedang berlangsung" },
            { key: "pushVote", label: "Voting reminder", desc: "Ingatkan untuk vote sebelum debat berakhir" },
            { key: "pushComment", label: "Interaksi komentar", desc: "Notifikasi likes dan balasan komentar" },
          ].map((item) => (
            <div key={item.key} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle checked={settings[item.key as keyof typeof settings]} onChange={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrivacySection() {
  const [settings, setSettings] = useState({
    showProfile: true,
    showActivity: false,
    allowMessages: true,
  });

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${checked ? "bg-blue-500" : "bg-gray-700"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Visibilitas Profil</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {[
            { key: "showProfile", label: "Tampilkan profil publik", desc: "Profil kamu bisa dilihat oleh user lain" },
            { key: "showActivity", label: "Tampilkan aktivitas", desc: "Riwayat debat dan voting bisa dilihat publik" },
            { key: "allowMessages", label: "Izinkan pesan langsung", desc: "User lain bisa mengirim pesan ke kamu" },
          ].map((item) => (
            <div key={item.key} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle checked={settings[item.key as keyof typeof settings]} onChange={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })} />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gray-900 border border-red-500/20 rounded-xl">
        <div className="px-5 py-4 border-b border-red-500/20">
          <h3 className="text-sm font-semibold text-red-400">Zona Bahaya</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Hapus Akun</p>
              <p className="text-xs text-gray-500 mt-0.5">Hapus akun dan semua data secara permanen</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer">
              Hapus Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
