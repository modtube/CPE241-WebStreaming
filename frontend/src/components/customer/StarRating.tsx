export default function StarRating({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < count ? "#efc8d5" : "#333", fontSize: "14px" }}>★</span>
      ))}
    </span>
  );
}