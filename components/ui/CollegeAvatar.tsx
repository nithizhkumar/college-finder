import type { College } from "@/lib/types";

export function CollegeAvatar({ college, size = 48 }: { college: Pick<College, "shortName" | "color">; size?: number }) {
  const initials = college.shortName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: size < 40 ? 8 : 12,
        background: college.color + "20",
        border: `2px solid ${college.color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: size * 0.22, color: college.color,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
