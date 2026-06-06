"use client";

import { useState } from "react";
import Link from "next/link";
import { CollegeAvatar } from "@/components/ui/CollegeAvatar";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { useSaved } from "@/context/SavedContext";
import { useCompare } from "@/context/CompareContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import type { College, Review, Question } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "overview" | "courses" | "placements" | "reviews" | "qa";

export function CollegeDetailClient({
  college,
  reviews: initialReviews,
  questions: initialQuestions,
}: {
  college: College;
  reviews: Review[];
  questions: Question[];
}) {
  const [tab, setTab]             = useState<Tab>("overview");
  const [questions, setQuestions] = useState(initialQuestions);
  const [newQ, setNewQ]           = useState("");
  const [posting, setPosting]     = useState(false);
  const { savedIds, toggleSave }  = useSaved();
  const { compareList, toggleCompare } = useCompare();
  const { user, openAuth }        = useAuth();

  const isSaved    = savedIds.includes(college.id);
  const inCompare  = compareList.includes(college.id);
  const typeVariant =
    college.type === "Government" ? "blue" : college.type === "Deemed" ? "orange" : "purple";

  const postQuestion = async () => {
    if (!newQ.trim()) return;
    if (!user) { openAuth(); return; }
    setPosting(true);
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newQ, collegeId: college.id, userName: user.name }),
    });
    const { question } = await res.json();
    setQuestions((prev) => [question, ...prev]);
    setNewQ("");
    setPosting(false);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview",   label: "Overview" },
    { id: "courses",    label: "Courses" },
    { id: "placements", label: "Placements" },
    { id: "reviews",    label: `Reviews (${initialReviews.length})` },
    { id: "qa",         label: `Q&A (${questions.length})` },
  ];

  return (
    <div className="pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-blue-700">Home</Link>
        <span>›</span>
        <span className="text-gray-600">{college.shortName}</span>
      </div>

      {/* Hero card */}
      <div
        className="rounded-2xl p-6 mb-6 border"
        style={{ background: college.color + "0a", borderColor: college.color + "30" }}
      >
        <div className="flex gap-4 items-start flex-wrap">
          <CollegeAvatar college={college} size={80} />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">{college.name}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  📍 {college.location} &nbsp;·&nbsp; Est. {college.established} &nbsp;·&nbsp;
                  <Badge variant={typeVariant} className="ml-1">{college.type}</Badge>
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { if (!user) { openAuth(); return; } toggleSave(college.id); }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold border transition-colors",
                    isSaved
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {isSaved ? "♥ Saved" : "♡ Save"}
                </button>
                <button
                  onClick={() => toggleCompare(college.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold border transition-colors",
                    inCompare
                      ? "bg-amber-50 border-amber-300 text-amber-800"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {inCompare ? "✓ In Compare" : "+ Compare"}
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 mt-4">
              {[
                { label: "Rating",     value: `${college.rating}/5` },
                { label: "Ranking",    value: `#${college.ranking}` },
                { label: "Placement",  value: `${college.placementRate}%` },
                { label: "Avg Package",value: formatCurrency(college.avgPackage) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="text-xs text-gray-400 font-semibold">{label} </span>
                  <span className="text-sm font-bold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              tab === t.id
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="grid gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-3">About {college.shortName}</h2>
            <p className="text-gray-600 leading-relaxed">{college.overview}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Key Figures</h3>
              {[
                ["Annual Fees",       formatCurrency(college.fees)],
                ["Avg Package",       formatCurrency(college.avgPackage)],
                ["Highest Package",   formatCurrency(college.highestPackage)],
                ["Placement Rate",    `${college.placementRate}%`],
                ["Established",       college.established.toString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-bold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Available Streams</h3>
              {college.streams.map((s) => (
                <div key={s} className="flex items-center gap-2 py-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: college.color }} />
                  <span className="text-sm text-gray-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "courses" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-4">Programs Offered</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {college.courses.map((c) => (
              <div
                key={c}
                className="border rounded-xl p-4"
                style={{ background: college.color + "08", borderColor: college.color + "30" }}
              >
                <p className="font-bold text-sm" style={{ color: college.color }}>{c}</p>
                <p className="text-xs text-gray-500 mt-0.5">Full Time</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "placements" && (
        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Placement Rate",    value: `${college.placementRate}%`, color: "#10b981" },
              { label: "Average Package",   value: formatCurrency(college.avgPackage), color: college.color },
              { label: "Highest Package",   value: formatCurrency(college.highestPackage), color: "#f59e0b" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                <p className="text-3xl font-black" style={{ color }}>{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-base font-bold mb-4">Placement Success Rate</h3>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${college.placementRate}%`, background: `linear-gradient(90deg, ${college.color}, ${college.color}99)` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{college.placementRate}% of eligible students placed in the latest batch</p>
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div className="grid gap-3">
          {initialReviews.length === 0 && (
            <div className="text-center py-12 text-gray-400">No reviews yet.</div>
          )}
          {initialReviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: college.color + "20", color: college.color }}
                  >
                    {getInitials(r.user.name)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{r.user.name}</p>
                    <StarRating rating={r.rating} />
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "qa" && (
        <div>
          {/* Post a question */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
            <h3 className="font-bold text-sm mb-3">Ask a Question</h3>
            <textarea
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              placeholder={`Ask anything about ${college.shortName}…`}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={postQuestion}
              disabled={posting || !newQ.trim()}
              className="mt-2 px-5 py-2 text-white text-sm font-bold rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: college.color }}
            >
              {posting ? "Posting…" : "Post Question"}
            </button>
          </div>

          {/* Question list */}
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-5 mb-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                  {q.user.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 mb-1">{q.question}</p>
                  <p className="text-xs text-gray-400 mb-3">
                    by {q.user.name} · {q.upvotes} upvotes · {formatDate(q.createdAt)}
                  </p>
                  {q.answers.map((a) => (
                    <div key={a.id} className="bg-gray-50 rounded-xl p-3 mb-2">
                      <p className="text-sm text-gray-700">{a.text}</p>
                      <p className="text-xs text-gray-400 mt-1">— {a.user.name} · {a.upvotes} upvotes</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
