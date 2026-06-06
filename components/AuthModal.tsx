"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function AuthModal() {
  const { authOpen, closeAuth, login } = useAuth();
  const [mode, setMode]     = useState<"login" | "signup">("login");
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  if (!authOpen) return null;

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    if (mode === "signup" && !form.name) { setError("Name is required."); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError("Please enter a valid email."); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500)); // simulate network
    login({ name: form.name || form.email.split("@")[0], email: form.email });
    closeAuth();
    setForm({ name: "", email: "", password: "" });
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && closeAuth()}
    >
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">CollegeFinder · India&apos;s Discovery Platform</p>
          </div>
          <button
            onClick={closeAuth}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >✕</button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@email.com"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-700 text-white font-bold rounded-xl text-sm hover:bg-blue-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode((m) => m === "login" ? "signup" : "login"); setError(""); }}
            className="text-blue-700 font-semibold hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
