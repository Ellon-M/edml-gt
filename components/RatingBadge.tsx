// -----------------------------
// RatingBadge
// -----------------------------
export default function RatingBadge({ rating }: { rating?: number }) {
  return (
    <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.3L6.16 20l1.01-5.96L2.5 9.5l6.03-.88L12 3l3.47 5.62 6.03.88-4.67 4.54L17.84 20 12 17.3z" stroke="currentColor" strokeWidth="0" />
      </svg>
      <span>{rating?.toFixed(1) ?? '—'}</span>
    </div>
  );
}
