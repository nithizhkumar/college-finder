"use client";

import { useCompare } from "@/context/CompareContext";
import { MOCK_COLLEGES } from "@/lib/data";
import { CollegeAvatar } from "@/components/ui/CollegeAvatar";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import type { College } from "@/lib/types";

const METRICS = [
  { key: "fees",           label: "Annual Fees",     fmt: formatCurrency,             better: "lower" },
  { key: "rating",         label: "Rating",          fmt: (v: number) => `${v}/5`,   better: "higher" },
  { key: "avgPackage",     label: "Average Package", fmt: formatCurrency,             better: "higher" },
  { key: "highestPackage", label: "Highest Package", fmt: formatCurrency,             better: "higher" },
  { key: "placementRate",  label: "Placement Rate",  fmt: (v: number) => `${v}%`,    better: "higher" },
  { key: "ranking",        label: "Ranking",         fmt: (v: number) => `#${v}`,    better: "lower" },
];

function getBest(colleges: College[], key: keyof College, better: string): number {
  const vals = colleges.map((c) => c[key] as number);
  return better === "higher" ? Math.max(...vals) : Math.min(...vals);
}

export default function ComparePage() {
  const { compareList, toggleCompare, clearCompare } = useCompare();
  const colleges = compareList
    .map((id) => MOCK_COLLEGES.find((c) => c.id === id))
    .filter(Boolean) as College[];

  if (colleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">⚖️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No colleges selected</h2>
        <p className="text-gray-500 mb-6">
          Go to the search page and click &quot;+ Compare&quot; on any college card (up to 3).
        </p>
        <Link href="/" className="px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors">
          Browse Colleges →
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-900">College Comparison</h1>
        <button
          onClick={clearCompare}
          className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-100"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-200 min-w-[140px]">
                Metric
              </th>
              {colleges.map((c) => (
                <th
                  key={c.id}
                  className="p-4 border-b border-gray-200 min-w-[180px] text-center"
                  style={{ background: c.color + "08", borderTop: `3px solid ${c.color}` }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CollegeAvatar college={c} size={40} />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{c.shortName}</p>
                      <p className="text-xs text-gray-500">{c.location}</p>
                    </div>
                    <button
                      onClick={() => toggleCompare(c.id)}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {METRICS.map(({ key, label, fmt, better }) => {
              const best = getBest(colleges, key as keyof College, better);
              return (
                <tr key={key} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="p-4 text-sm font-semibold text-gray-600">{label}</td>
                  {colleges.map((c) => {
                    const val = c[key as keyof College] as number;
                    const isBest = val === best;
                    return (
                      <td
                        key={c.id}
                        className="p-4 text-center"
                        style={{ background: isBest ? c.color + "08" : undefined }}
                      >
                        <span
                          className={`text-sm ${isBest ? "font-extrabold" : "font-medium text-gray-700"}`}
                          style={{ color: isBest ? c.color : undefined }}
                        >
                          {fmt(val)}
                          {isBest && <span className="ml-1 text-xs">✓</span>}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Type row */}
            <tr className="border-b border-gray-100">
              <td className="p-4 text-sm font-semibold text-gray-600">Type</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-center">
                  <Badge variant={c.type === "Government" ? "blue" : c.type === "Deemed" ? "orange" : "purple"}>
                    {c.type}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* Streams row */}
            <tr className="border-b border-gray-100">
              <td className="p-4 text-sm font-semibold text-gray-600">Streams</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-center">
                  <p className="text-xs text-gray-600 leading-relaxed">{c.streams.join(", ")}</p>
                </td>
              ))}
            </tr>

            {/* View details row */}
            <tr>
              <td className="p-4 text-sm font-semibold text-gray-600">Details</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-center">
                  <Link
                    href={`/colleges/${c.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white inline-block"
                    style={{ background: c.color }}
                  >
                    View →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
