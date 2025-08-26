// -----------------------------
// AmenitiesList
// -----------------------------
function AmenityIcon({ name }: { name: string }) {
  // simple switch with a few icons; extend as needed
  switch (name.toLowerCase()) {
    case "wifi":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 8.5C8 3 16 3 22 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 11.5C8 9 16 9 19 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14.5C11 12 13 12 16 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 18.5L12 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "parking":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3H14C17.866 3 21 6.13401 21 10V15C21 19.4183 17.4183 23 13 23H6V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 8H13.5C15.9853 8 18 10.0147 18 12.5C18 14.9853 15.9853 17 13.5 17H10V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function AmenitiesList({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {items.map((it) => (
        <div
          key={it}
          className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-sm"
        >
          <AmenityIcon name={it} />
          <span className="text-sm text-gray-700">{it}</span>
        </div>
      ))}
    </div>
  );
}
