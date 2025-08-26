import { ratingBuckets, RatingBucket } from '@/lib/utils';

interface FilterSidebarProps {
  amenities: string[];
  selectedAmenities: string[];
  onToggleAmenity: (amenity: string) => void;
  dateRange: { start?: string; end?: string };
  onDateChange: (name: 'start' | 'end', value: string) => void;
  ratings: { value: number; label: string }[];
  selectedRating?: number;
  onSelectRating: (value: number) => void;
  propertyTypes: string[];
  selectedTypes: string[];
  onToggleType: (type: string) => void;
  rooms: string[];
  selectedRooms: string[];
  onToggleRoom: (room: string) => void;
}

export default function FilterSidebar({
  amenities,
  selectedAmenities,
  onToggleAmenity,
  dateRange,
  onDateChange,
  ratings,
  selectedRating,
  onSelectRating,
  propertyTypes,
  selectedTypes,
  onToggleType,
  rooms,
  selectedRooms,
  onToggleRoom,
}: FilterSidebarProps) {
  return (
    <aside className="bg-white shadow rounded-xl p-4">
      <h3 className="text-xl font-semibold mb-4">Filters</h3>

      {/* Availability */}
      <div className="mb-6 text-sm">
        <h4 className="font-medium mb-2">Availability</h4>
        <label className="block mb-2">
          <span className="text-gray-700">Check-in</span>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md"
            value={dateRange.start || ''}
            onChange={(e) => onDateChange('start', e.target.value)}
          />
        </label>
        <label>
          <span className="text-gray-700">Check-out</span>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md"
            value={dateRange.end || ''}
            onChange={(e) => onDateChange('end', e.target.value)}
          />
        </label>
      </div>

      {/* Amenities */}
      <div className="mb-6 text-sm">
        <h4 className="font-medium mb-2">Amenities</h4>
        <ul className="space-y-2">
          {amenities.map((amenity, idx) => (
            <li key={`${amenity}-${idx}`}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-[#800000]"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => onToggleAmenity(amenity)}
                />
                <span className="ml-2 text-gray-700">{amenity}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Rating Score */}
      <div className="mb-6 text-sm">
        <h4 className="font-medium mb-2">Rating Score</h4>
        <ul className="space-y-2">
          {ratingBuckets.map((bucket, idx) => (
            <li key={`rating-${bucket.min}-${idx}`}>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="rating"
                  className="form-radio h-5 w-5 text-[#800000]"
                  checked={selectedRating === bucket.min}
                  onChange={() => onSelectRating(bucket.min)}
                />
                <span className="ml-2 text-gray-700">
                  {bucket.label} ({bucket.min}{bucket.max === Infinity ? '+' : `–${bucket.max}`})
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Property Type */}
      <div className="mb-6 text-sm">
        <h4 className="font-medium mb-2">Property Type</h4>
        <ul className="space-y-2">
          {propertyTypes.map((type, idx) => (
            <li key={`${type}-${idx}`}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-[#800000]"
                  checked={selectedTypes.includes(type)}
                  onChange={() => onToggleType(type)}
                />
                <span className="ml-2 text-gray-700">{type}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Rooms */}
      <div className="text-sm">
        <h4 className="font-medium mb-2">Rooms</h4>
        <ul className="space-y-2">
          {rooms.map((room, idx) => (
            <li key={`${room}-${idx}`}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-[#800000]"
                  checked={selectedRooms.includes(room)}
                  onChange={() => onToggleRoom(room)}
                />
                <span className="ml-2 text-gray-700">{room}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
