import { NextRequest, NextResponse } from "next/server";
import { MOCK_COLLEGES, MOCK_REVIEWS, MOCK_QUESTIONS } from "@/lib/data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const college = MOCK_COLLEGES.find((c) => c.id === id);
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const reviews = MOCK_REVIEWS.filter((r) => r.collegeId === id);
    const questions = MOCK_QUESTIONS.filter(
      (q) => q.collegeId === id || q.collegeId === null
    );

    return NextResponse.json({ college, reviews, questions });
  } catch (err) {
    console.error("GET /api/colleges/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
