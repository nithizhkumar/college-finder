"use client";

import { useCompare } from "@/context/CompareContext";
import { MOCK_COLLEGES } from "@/lib/data";
import Link from "next/link";
import { CollegeAvatar } from "./ui/CollegeAvatar";
import type { College } from "@/lib/types";

export function CompareBar() {
  const { compareList, toggleCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  const colleges = compareList
    .map((id) => MOCK_COLLEGES.find((c) => c.id === id))
    .filter(Boolean) as College[];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-200 shadow-2xl z-40 p-3">
      <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wide flex-shrink-0">
          ⚖️ Compare ({compareList.length}/3)
        </span>

        <div className="flex gap-2 flex-1 flex-wrap">
          {colleges.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5"
            >
              <CollegeAvatar college={c} size={24} />
              <span className="text-xs font-semibold text-gray-800">{c.shortName}</span>
              <button
                onClick={() => toggleCompare(c.id)}
                className="text-gray-400 hover:text-red-500 text-sm ml-1"
              >✕</button>
            </div>
          ))}
          {compareList.length < 3 && (
            <div className="flex items-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-1.5 text-xs text-gray-400">
              + Add {3 - compareList.length} more
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs px-3 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="text-xs px-4 py-2 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
          >
            Compare Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
