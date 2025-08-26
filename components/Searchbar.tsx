// components/Searchbar.tsx
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  initialValue?: string;
}

export default function SearchBar({ placeholder = "Search properties...", onSearch, initialValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    onSearch?.(query);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex items-center mb-4">
      <div className="relative w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-transparent"
          placeholder={placeholder}
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-[#800000] text-white py-2.5 px-4 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#800000] hover:bg-[#880000] transition duration-300"
      >
        Search
      </button>
    </div>
  );
}
