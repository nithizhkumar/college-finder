import { NextRequest, NextResponse } from "next/server";

// In-memory store (replace with Prisma in production)
const savedMap = new Map<string, Set<string>>(); // userId -> Set<collegeId>

function getUserId(req: NextRequest): string | null {
  // In production this reads from NextAuth session
  // For demo: read from x-user-id header (set by client mock)
  return req.headers.get("x-user-id");
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ids = Array.from(savedMap.get(userId) ?? []);
  return NextResponse.json({ savedIds: ids });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { collegeId } = body as { collegeId: string };
  if (!collegeId) return NextResponse.json({ error: "collegeId required" }, { status: 400 });

  if (!savedMap.has(userId)) savedMap.set(userId, new Set());
  const set = savedMap.get(userId)!;

  if (set.has(collegeId)) {
    set.delete(collegeId);
    return NextResponse.json({ action: "removed", savedIds: Array.from(set) });
  } else {
    set.add(collegeId);
    return NextResponse.json({ action: "saved", savedIds: Array.from(set) });
  }
}
