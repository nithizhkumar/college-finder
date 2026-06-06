"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "./ui/Badge";
import { StarRating } from "./ui/StarRating";
import { CollegeAvatar } from "./ui/CollegeAvatar";
import { useCompare } from "@/context/CompareContext";
import { useSaved } from "@/context/SavedContext";
import { useAuth } from "@/context/AuthContext";
import type { College } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CollegeCard({ college }: { college: College }) {
  const { compareList, toggleCompare } = useCompare();
  const { savedIds, toggleSave } = useSaved();
  const { user, openAuth } = useAuth();

  const isSaved   = savedIds.includes(college.id);
  const inCompare = compareList.includes(college.id);
  const typeVariant =
    college.type === "Government" ? "blue" : college.type === "Deemed" ? "orange" : "purple";

  const handleSave = () => {
    if (!user) { openAuth(); return; }
    toggleSave(college.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex gap-3 items-start">
        <CollegeAvatar college={college} size={52} />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{college.name}</h3>
            <button
              onClick={handleSave}
              aria-label={isSaved ? "Remove from saved" : "Save college"}
              className={cn(
                "text-xl flex-shrink-0 transition-colors",
                isSaved ? "text-red-500" : "text-gray-300 hover:text-red-400"
              )}
            >
              {isSaved ? "♥" : "♡"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">📍 {college.location}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge variant={typeVariant}>{college.type}</Badge>
        {college.tags.slice(0, 2).map((t) => (
          <Badge key={t} variant="gray">{t}</Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Rating", value: <span className="flex items-center gap-1">{college.rating} <StarRating rating={college.rating} size={11} /></span> },
          { label: "Avg Pkg",  value: formatCurrency(college.avgPackage) },
          { label: "Fees/yr", value: formatCurrency(college.fees) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-xl px-2.5 py-2">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-xs font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/colleges/${college.id}`}
          className="flex-1 text-center py-2 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
          style={{ background: college.color }}
        >
          View Details
        </Link>
        <button
          onClick={() => toggleCompare(college.id)}
          className={cn(
            "px-3 py-2 rounded-xl text-xs font-semibold border transition-colors",
            inCompare
              ? "bg-amber-50 border-amber-300 text-amber-800"
              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
          )}
        >
          {inCompare ? "✓ Added" : "+ Compare"}
        </button>
      </div>
    </div>
  );
}
