"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { MOCK_COLLEGES } from "@/lib/data";

const ALL_STREAMS = [...new Set(MOCK_COLLEGES.flatMap((c) => c.streams))].sort();
const ALL_STATES  = [...new Set(MOCK_COLLEGES.map((c) => c.state))].sort();

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => {
    setSearch("");
    router.push("/");
  };

  const hasFilters =
    searchParams.get("q") ||
    searchParams.get("type") ||
    searchParams.get("stream") ||
    searchParams.get("state");

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5">
      {/* Search bar */}
      <div className="flex gap-3 mb-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && update("q", search)}
            onBlur={() => update("q", search)}
            placeholder="Search colleges, locations, tags..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select
          value={searchParams.get("sort") ?? "ranking"}
          onChange={(e) => update("sort", e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="ranking">Ranking</option>
          <option value="rating">Rating</option>
          <option value="fees_low">Fees: Low → High</option>
          <option value="fees_high">Fees: High → Low</option>
          <option value="package">Avg Package</option>
        </select>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        <select
          value={searchParams.get("type") ?? ""}
          onChange={(e) => update("type", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Types</option>
          <option value="Government">Government</option>
          <option value="Deemed">Deemed</option>
          <option value="Private">Private</option>
        </select>

        <select
          value={searchParams.get("stream") ?? ""}
          onChange={(e) => update("stream", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Streams</option>
          {ALL_STREAMS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={searchParams.get("state") ?? ""}
          onChange={(e) => update("state", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All States</option>
          {ALL_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
          >
            ✕ Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
