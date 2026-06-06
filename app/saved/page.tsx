"use client";

import { useSaved } from "@/context/SavedContext";
import { useAuth } from "@/context/AuthContext";
import { MOCK_COLLEGES } from "@/lib/data";
import { CollegeAvatar } from "@/components/ui/CollegeAvatar";
import { StarRating } from "@/components/ui/StarRating";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import type { College } from "@/lib/types";

export default function SavedPage() {
  const { savedIds, toggleSave } = useSaved();
  const { user, openAuth }       = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to view saved colleges</h2>
        <p className="text-gray-500 mb-6">Create a free account to save and track your shortlist.</p>
        <button
          onClick={openAuth}
          className="px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800"
        >
          Sign In / Sign Up
        </button>
      </div>
    );
  }

  const saved = MOCK_COLLEGES.filter((c) => savedIds.includes(c.id)) as College[];

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">♡</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No saved colleges yet</h2>
        <p className="text-gray-500 mb-6">Click the heart icon on any college card to save it here.</p>
        <Link href="/" className="px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800">
          Explore Colleges →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-900">
          Saved Colleges
          <span className="ml-2 text-base font-semibold text-gray-400">({saved.length})</span>
        </h1>
      </div>

      <div className="grid gap-3">
        {saved.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <CollegeAvatar college={c} size={52} />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900">{c.name}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-0.5">
                <p className="text-xs text-gray-500">📍 {c.location}</p>
                <p className="text-xs text-gray-500">{formatCurrency(c.fees)}/yr</p>
                <StarRating rating={c.rating} size={12} />
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/colleges/${c.id}`}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: c.color }}
              >
                View
              </Link>
              <button
                onClick={() => toggleSave(c.id)}
                className="px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-600 hover:bg-red-100"
              >
                ♥
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
