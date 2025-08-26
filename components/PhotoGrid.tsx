"use client";

import React from "react";

// Improved PhotoGrid: wider image area and full-width thumbnail row
export default function PhotoGrid({ images, onOpen }: { images: string[]; onOpen: (startIndex: number) => void }) {
  const mainPhotos = images.slice(0, 4);
  const thumbs = images.slice(0, 4);
  const overflow = images.length - 4;

  return (
    <div className="w-full">
      {/* Use 4 columns on large screens so the photo area can span 3/4 (75%) and map 1/4 (25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* photo area spans 3 cols on lg to be wider */}
        <div className="lg:col-span-3">
          {/* 2x2 main photos */}
          <div className="grid grid-cols-2 gap-3">
            {mainPhotos.map((src, i) => (
              <button
                key={src + i}
                onClick={() => onOpen(i)}
                className="block w-full h-56 sm:h-64 md:h-80 overflow-hidden rounded-lg relative cursor-pointer"
                aria-label={`Open photo ${i + 1}`}
              >
                <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover transform transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg pointer-events-none" />
              </button>
            ))}
          </div>

          {/* thumbnails: make them stretch full width with a 4-column grid */}
          <div className="mt-3 grid grid-cols-4 gap-3">
            {thumbs.map((src, i) => (
              <div key={src + i} className="relative w-full h-20 rounded-md overflow-hidden cursor-pointer">
                <button onClick={() => onOpen(i)} className="w-full h-full block">
                  <img
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>

                {i === 3 && overflow > 0 && (
                  <button
                    onClick={() => onOpen(4)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium"
                    aria-label={`Open all ${images.length} photos`}
                  >
                    +{overflow} photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* map placeholder */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="w-full h-full rounded-lg min-h-[420px]">
            <img src="/map-placeholder.png" alt="Maps API" className="w-full h-1/3 object-cover overflow-hidden border border-gray-200" />
          </div>
        </div>
      </div>

      {/* On small screens show map placeholder below grid */}
      <div className="block lg:hidden mt-4">
        <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200">
          <img src="/images/map-placeholder.png" alt="Maps API" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
