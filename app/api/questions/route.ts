import { NextRequest, NextResponse } from "next/server";
import { MOCK_QUESTIONS } from "@/lib/data";

// In-memory question store (extends mock data)
let questions = [...MOCK_QUESTIONS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const collegeId = searchParams.get("collegeId");

  const result = collegeId
    ? questions.filter((q) => q.collegeId === collegeId || q.collegeId === null)
    : questions;

  return NextResponse.json({ questions: result });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, collegeId, userName } = body as {
      question: string;
      collegeId?: string;
      userName?: string;
    };

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question text is required" }, { status: 400 });
    }

    const newQ = {
      id: `q-${Date.now()}`,
      collegeId: collegeId ?? null,
      userId: `u-anon-${Date.now()}`,
      question: question.trim(),
      upvotes: 0,
      user: { name: userName ?? "Anonymous" },
      createdAt: new Date().toISOString(),
      answers: [],
    };

    questions = [newQ, ...questions];
    return NextResponse.json({ question: newQ }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
