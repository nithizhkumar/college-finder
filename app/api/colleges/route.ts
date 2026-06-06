import { NextRequest, NextResponse } from "next/server";
import { MOCK_COLLEGES } from "@/lib/data";
import type { College, SearchFilters } from "@/lib/types";

function applyFilters(colleges: College[], filters: SearchFilters): College[] {
  let result = [...colleges];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.type) {
    result = result.filter((c) => c.type === filters.type);
  }

  if (filters.stream) {
    result = result.filter((c) => c.streams.includes(filters.stream!));
  }

  if (filters.state) {
    result = result.filter((c) => c.state === filters.state);
  }

  // Sorting
  result.sort((a, b) => {
    switch (filters.sort) {
      case "rating":      return b.rating - a.rating;
      case "fees_low":    return a.fees - b.fees;
      case "fees_high":   return b.fees - a.fees;
      case "package":     return b.avgPackage - a.avgPackage;
      default:            return a.ranking - b.ranking; // ranking
    }
  });

  return result;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters: SearchFilters = {
      q: searchParams.get("q") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      stream: searchParams.get("stream") ?? undefined,
      state: searchParams.get("state") ?? undefined,
      sort: (searchParams.get("sort") as SearchFilters["sort"]) ?? "ranking",
      page: parseInt(searchParams.get("page") ?? "1"),
      limit: parseInt(searchParams.get("limit") ?? "12"),
    };

    const filtered = applyFilters(MOCK_COLLEGES as College[], filters);
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const total = filtered.length;
    const data = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    console.error("GET /api/colleges error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
