import { NextRequest, NextResponse } from "next/server";
import { MOCK_COLLEGES } from "@/lib/data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

    if (ids.length < 2) {
      return NextResponse.json(
        { error: "At least 2 college IDs required" },
        { status: 400 }
      );
    }

    if (ids.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 colleges can be compared" },
        { status: 400 }
      );
    }

    const colleges = ids.map((id) => MOCK_COLLEGES.find((c) => c.id === id)).filter(Boolean);

    if (colleges.length !== ids.length) {
      return NextResponse.json(
        { error: "One or more colleges not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ colleges });
  } catch (err) {
    console.error("GET /api/compare error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
