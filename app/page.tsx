import { Suspense } from "react";
import { SearchFilters } from "@/components/SearchFilters";
import { CollegeCard } from "@/components/CollegeCard";
import { MOCK_COLLEGES } from "@/lib/data";
import type { College, SearchFilters as SF } from "@/lib/types";

function filterColleges(colleges: College[], params: SF): { data: College[]; total: number } {
  let result = [...colleges];

  if (params.q) {
    const q = params.q.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (params.type)   result = result.filter((c) => c.type === params.type);
  if (params.stream) result = result.filter((c) => c.streams.includes(params.stream!));
  if (params.state)  result = result.filter((c) => c.state === params.state);

  result.sort((a, b) => {
    switch (params.sort) {
      case "rating":     return b.rating - a.rating;
      case "fees_low":   return a.fees - b.fees;
      case "fees_high":  return b.fees - a.fees;
      case "package":    return b.avgPackage - a.avgPackage;
      default:           return a.ranking - b.ranking;
    }
  });

  return { data: result, total: result.length };
}

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters: SF = {
    q: sp.q,
    type: sp.type,
    stream: sp.stream,
    state: sp.state,
    sort: (sp.sort as SF["sort"]) ?? "ranking",
  };

  const { data: colleges, total } = filterColleges(MOCK_COLLEGES as College[], filters);

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
          Find Your{" "}
          <span className="text-blue-700">Dream College</span>
        </h1>
        <p className="text-gray-500 text-base">
          Search, compare, and explore India&apos;s top colleges — with real placement data & reviews
        </p>
      </div>

      {/* Filters */}
      <Suspense>
        <SearchFilters />
      </Suspense>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing <strong className="text-gray-900">{total}</strong> college{total !== 1 ? "s" : ""}
          {filters.q ? ` for "${filters.q}"` : ""}
        </p>
      </div>

      {/* Grid */}
      {colleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-24">
          {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🎓</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-1">No colleges found</h3>
          <p className="text-sm">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
}
