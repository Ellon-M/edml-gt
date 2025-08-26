import { FC, useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SortingDropdownProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}

export default function SortingDropdown({
  options,
  selected,
  onChange,
}: SortingDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const label = options.find((o) => o.value === selected)?.label || "";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative mb-4 inline-block text-left" ref={containerRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        data-testid="sorters-dropdown-trigger"
        data-selected-sorter={selected}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center space-x-2 border border-gray-300 bg-white rounded-full px-3 py-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition duration-150"
      >
        {/* Up/down arrows */}
        <div className="flex flex-row items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#424242ff"
            width="14px"
            data-rtl-flip="true"
          >
            <path d="M10.28 15.22a.75.75 0 0 1 0 1.06l-4.5 4.5a.8.8 0 0 1-.24.16.73.73 0 0 1-.58 0 .8.8 0 0 1-.24-.16l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3.75a.75.75 0 0 1 1.5 0v14.69l3.22-3.22a.75.75 0 0 1 1.06 0m13.5-7.5-4.5-4.5a.8.8 0 0 0-.28-.16.73.73 0 0 0-.58 0 .8.8 0 0 0-.24.16l-4.5 4.5a.75.75 0 1 0 1.06 1.06L18 5.56v14.69a.75.75 0 0 0 1.5 0V5.56l3.22 3.22a.75.75 0 0 0 1.06 0 .75.75 0 0 0 0-1.06"></path>
          </svg>
        </div>
        {/* Label */}
        <span className="text-gray-700 text-sm whitespace-nowrap">
          Sort by: {label}
        </span>
        {/* Dropdown chevron */}
        <div className="flex flex-col items-center justify-center">
          <ChevronUp size={12} className="text-gray-500" />
          <ChevronDown size={12} className="text-gray-500 mt-[-4px]" />
        </div>
      </button>

      {open && (
        <div
          data-testid="sorters-dropdown"
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 transition ease-out duration-150 transform origin-top-right"
        >
          <ul className="py-2">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  data-id={opt.value}
                  aria-label={opt.label}
                  role="option"
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                >
                  <span className="text-gray-700">{opt.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hidden select for accessibility */}
      <select
        aria-label="Sort listings"
        className="sr-only"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
