"use client";

import { useAuthStore } from "@/stores/auth-store";

export default function DashboardProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Profil Saya</h2>
        <p className="text-sm text-gray-500 mt-1">Kelola informasi akun kamu</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-24 h-24 rounded-full border-4 border-gray-900" />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-4 border-gray-900 flex items-center justify-center text-white text-2xl font-bold">
                {user?.display_name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U"}
              </div>
            )}
            <div className="pb-1">
              <h3 className="text-xl font-bold text-white">{user?.display_name || "User"}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Debate Diikuti", value: "12", icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" },
          { label: "Total Vote", value: "47", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
          { label: "Komentar", value: "23", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
          { label: "Points", value: "1,250", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <svg className="w-6 h-6 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
            </svg>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Account Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Informasi Akun</h3>
          <a href="/dashboard/settings" className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
            Atur Password &rarr;
          </a>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: "Email", value: user?.email || "-" },
            { label: "Display Name", value: user?.display_name || "-" },
            { label: "Role", value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "-" },
            { label: "Member Sejak", value: "10 Mei 2026" },
          ].map((info) => (
            <div key={info.label} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <span className="text-sm text-gray-500">{info.label}</span>
              <span className="text-sm text-white font-medium">{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Akun Terhubung</h3>
        </div>
        <div className="p-5 space-y-3">
          {[
            { name: "Google", email: user?.email || "-", connected: true, icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" },
            { name: "SSO DigTri", email: user?.email || "-", connected: true, icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" },
          ].map((account) => (
            <div key={account.name} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d={account.icon} />
                </svg>
                <div>
                  <p className="text-sm font-medium text-white">{account.name}</p>
                  <p className="text-xs text-gray-500">{account.email}</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-full">
                Connected
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
