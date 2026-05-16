"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Settings</h3>
        <p className="text-sm text-gray-500">Configure your platform settings</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1 w-fit">
        {[
          { id: "general", label: "General" },
          { id: "auth", label: "Authentication" },
          { id: "ai", label: "AI Provider" },
          { id: "notifications", label: "Notifications" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
              activeTab === tab.id ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <h4 className="text-sm font-semibold text-white">General Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Platform Name</label>
              <input type="text" defaultValue="edLive" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Platform URL</label>
              <input type="text" defaultValue="http://localhost:4001" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Default Session Type</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="education">Education</option>
                <option value="viewer">Viewer</option>
                <option value="enjoy">Enjoy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Speakers Per Debate</label>
              <input type="number" defaultValue={6} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">Save Changes</button>
          </div>
        </div>
      )}

      {/* Auth Settings */}
      {activeTab === "auth" && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
            <h4 className="text-sm font-semibold text-white">SSO Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">SSO URL</label>
                <input type="text" defaultValue="http://localhost:4000" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">JWT Secret</label>
                <input type="password" defaultValue="dev-jwt-secret-12345" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
            <h4 className="text-sm font-semibold text-white">Google OAuth</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Client ID</label>
                <input type="text" defaultValue="248442835812-xxx.apps.googleusercontent.com" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Client Secret</label>
                <input type="password" defaultValue="GOCSPX-xxx" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Redirect URI</label>
                <input type="text" defaultValue="http://localhost:4001/auth/google/callback" readOnly className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">Save Auth Settings</button>
          </div>
        </div>
      )}

      {/* AI Settings */}
      {activeTab === "ai" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <h4 className="text-sm font-semibold text-white">AI Provider Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Default Provider</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="groq">Groq</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">API Key</label>
              <input type="password" placeholder="Enter API key..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300">AI Features</h5>
            {[
              { label: "Logical Fallacy Detection", desc: "Automatically detect fallacies during debates", enabled: true },
              { label: "Auto Summary", desc: "Generate debate summaries in real-time", enabled: true },
              { label: "Knowledge Assistant", desc: "Provide context and data during debates", enabled: false },
              { label: "Sentiment Analysis", desc: "Analyze audience sentiment in real-time", enabled: false },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">{feature.label}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
                <div className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${feature.enabled ? "bg-blue-500" : "bg-gray-600"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${feature.enabled ? "translate-x-5" : "translate-x-1"}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">Save AI Settings</button>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <h4 className="text-sm font-semibold text-white">Notification Settings</h4>
          {[
            { label: "New Debate Created", desc: "Notify when a new debate is scheduled", enabled: true },
            { label: "Live Debate Started", desc: "Notify when a debate goes live", enabled: true },
            { label: "Flagged Comments", desc: "Notify when comments are flagged", enabled: true },
            { label: "AI Fallacy Alert", desc: "Notify when AI detects logical fallacies", enabled: false },
            { label: "Media Upload Pending", desc: "Notify when media needs approval", enabled: true },
          ].map((notif) => (
            <div key={notif.label} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm font-medium text-white">{notif.label}</p>
                <p className="text-xs text-gray-500">{notif.desc}</p>
              </div>
              <div className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${notif.enabled ? "bg-blue-500" : "bg-gray-600"}`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${notif.enabled ? "translate-x-5" : "translate-x-1"}`} />
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">Save Notification Settings</button>
          </div>
        </div>
      )}
    </div>
  );
}
