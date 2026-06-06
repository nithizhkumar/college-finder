export function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{ color: i <= Math.round(rating) ? "#f59e0b" : "#d1d5db" }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
