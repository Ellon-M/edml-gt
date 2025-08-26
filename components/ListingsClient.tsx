"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/Searchbar";
import FilterSidebar from "@/components/FilterSidebar";
import SortingDropdown from "@/components/SortingDropdown";
import PropertyGrid from "@/components/PropertyGrid";

export interface PublicProperty {
  id: string;
  slug: string;
  title: string;
  location: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  amenities?: string[];
  rooms?: string | number;
  type?: string;
  images: string[];
  description?: string;
}

export default function ListingsClient({
  initialProperties,
  initialSearchQuery,
}: {
  initialProperties: PublicProperty[];
  initialSearchQuery?: string;
}) {
  const router = useRouter();

  // client-only UI state — prefill search query from server-provided value
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery ?? "");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  const sortingOptions = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest Listings" },
  ];
  const [sortBy, setSortBy] = useState(sortingOptions[0].value);

  const [selectedRating, setSelectedRating] = useState<number | undefined>();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  // mobile filter drawer visibility
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleToggleAmenity = (amenity: string) => {
    setAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]));
  };
  const handleDateChange = (name: "start" | "end", value: string) => setDateRange((p) => ({ ...p, [name]: value }));
  const handleSelectRating = (value: number) => setSelectedRating(value);
  const handleToggleType = (type: string) => setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  const handleToggleRoom = (room: string) => setSelectedRooms((prev) => (prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]));

  // compute candidate lists for filters from the initial data
  const allAmenities = useMemo(() => Array.from(new Set(initialProperties.flatMap((p) => p.amenities ?? []))).sort(), [initialProperties]);
  const allTypes = useMemo(() => Array.from(new Set(initialProperties.map((p) => p.type).filter(Boolean) as string[])).sort(), [initialProperties]);
  const allRooms = useMemo(() => Array.from(new Set(initialProperties.map((p) => (p.rooms ?? "").toString()).filter(Boolean))).sort(), [initialProperties]);
  const ratings = useMemo(() => Array.from(new Set(initialProperties.map((p) => p.rating).filter(Boolean))).map((r) => ({ value: r, label: `${r} Stars` })), [initialProperties]);

  // when user searches from this page, update the URL so the server re-runs search
  const onSearch = (q: string) => {
    const params = new URLSearchParams(window.location.search);
    if (q) params.set("q", q);
    else params.delete("q");
    // clear page param when searching
    params.delete("page");
    router.push(`/properties?${params.toString()}`);
  };

  // client-side filtering/searching/sorting (applied on top of server results)
  const filtered = useMemo(() => {
    let out = initialProperties.slice();

    // search by title/location
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      out = out.filter((p) => (p.title + " " + p.location + " " + (p.description ?? "")).toLowerCase().includes(q));
    }

    // amenities filter
    if (amenities.length) {
      out = out.filter((p) => (p.amenities ?? []).some((a) => amenities.includes(a)));
    }

    // rating filter
    if (selectedRating) {
      out = out.filter((p) => Math.round(p.rating) >= selectedRating);
    }

    // type filter
    if (selectedTypes.length) {
      out = out.filter((p) => selectedTypes.includes(String(p.type)));
    }

    // rooms filter
    if (selectedRooms.length) {
      out = out.filter((p) => selectedRooms.includes(String(p.rooms)));
    }

    // sorting
    if (sortBy === "price_asc") out.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sortBy === "price_desc") out.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (sortBy === "newest") out = out; // server already sorted by createdAt

    return out;
  }, [initialProperties, searchQuery, amenities, selectedRating, selectedTypes, selectedRooms, sortBy]);

  return (
    <div className="md:flex md:space-x-6">
      {/* Sidebar (desktop) */}
      <div className="hidden md:block md:flex-shrink-0">
        <FilterSidebar
          amenities={allAmenities}
          selectedAmenities={amenities}
          onToggleAmenity={handleToggleAmenity}
          dateRange={dateRange}
          onDateChange={handleDateChange}
          ratings={ratings}
          selectedRating={selectedRating}
          onSelectRating={handleSelectRating}
          propertyTypes={allTypes}
          selectedTypes={selectedTypes}
          onToggleType={handleToggleType}
          rooms={allRooms}
          selectedRooms={selectedRooms}
          onToggleRoom={handleToggleRoom}
        />
      </div>

      {/* Main column */}
      <div className="flex-1">
        {/* Mobile filter/search bar row */}
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 border rounded text-sm"
            aria-expanded={mobileFiltersOpen}
          >
            Filters
          </button>

          <div className="flex-1">
            <SearchBar
              placeholder="Search properties..."
              initialValue={searchQuery}
              onSearch={(v) => {
                setSearchQuery(v);
                onSearch(v);
              }}
            />
          </div>

          <div className="hidden sm:flex items-center">
            <SortingDropdown options={sortingOptions} selected={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* On small screens show sorting underneath search for accessibility */}
        <div className="block sm:hidden mb-4">
          <SortingDropdown options={sortingOptions} selected={sortBy} onChange={setSortBy} />
        </div>

        <PropertyGrid properties={filtered} />
      </div>

      {/* Mobile filter slide-over */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />

          {/* panel */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="px-2 py-1 text-sm">Close</button>
            </div>

            <FilterSidebar
              amenities={allAmenities}
              selectedAmenities={amenities}
              onToggleAmenity={handleToggleAmenity}
              dateRange={dateRange}
              onDateChange={handleDateChange}
              ratings={ratings}
              selectedRating={selectedRating}
              onSelectRating={handleSelectRating}
              propertyTypes={allTypes}
              selectedTypes={selectedTypes}
              onToggleType={handleToggleType}
              rooms={allRooms}
              selectedRooms={selectedRooms}
              onToggleRoom={handleToggleRoom}
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 px-3 py-2 border rounded"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  // reset mobile filters quickly (you can enhance this to preserve previous state)
                  setAmenities([]);
                  setSelectedRating(undefined);
                  setSelectedTypes([]);
                  setSelectedRooms([]);
                  setDateRange({});
                }}
                className="flex-1 px-3 py-2 border rounded text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
