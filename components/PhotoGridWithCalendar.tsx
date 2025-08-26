// components/PhotoGridWithCalendar.tsx
"use client";

import React from "react";

function staticMapUrl(lat: number, lng: number, apiKey: string) {
  // use scale=2 for a crisper image on high-dpi screens
  const size = "640x320";
  const zoom = 15;
  const marker = `color:red%7C${lat},${lng}`;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&scale=2&markers=${marker}&key=${apiKey}`;
}

export default function PhotoGridWithCalendar({
  photos,
  onOpen,
  bookedDates,
  latitude,
  longitude,
}: {
  photos: string[];
  onOpen: (startIndex: number) => void;
  bookedDates: string[];
  latitude?: number;
  longitude?: number;
}) {
  const mainPhotos = photos.slice(0, 4);
  const thumbs = photos.slice(0, 4);
  const overflow = photos.length - 4;
  const MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="grid gris-cols-1 lg:grid-cols-2 gap-1">
            {mainPhotos.map((src, i) => (
              <button
                key={src + i}
                onClick={() => onOpen(i)}
                className="block w-full h-56 sm:h-64 md:h-80 overflow-hidden rounded-lg relative cursor-pointer"
                aria-label={`Open photo ${i + 1}`}
              >
                <img
                  src={src}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover transform transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg pointer-events-none" />
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {thumbs.map((src, i) => (
              <div key={src + i} className="relative w-full h-20 rounded-md overflow-hidden cursor-pointer">
                <button onClick={() => onOpen(i)} className="w-full h-full block">
                  <img src={src} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>

                {i === 3 && overflow > 0 && (
                  <button
                    onClick={() => onOpen(4)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium"
                    aria-label={`Open all ${photos.length} photos`}
                  >
                    +{overflow} photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Map + calendar */}
          <div className="w-full hidden lg:block h-[420px] rounded-lg overflow-hidden border border-gray-200">
            {latitude && longitude && MAP_KEY ? (
              // clickable: opens Google Maps search at lat,lng in a new tab
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <img
                  src={staticMapUrl(latitude, longitude, MAP_KEY)}
                  alt="Map preview"
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <img src="/map-placeholder.png" alt="Map placeholder" className="w-full h-full object-cover" />
            )}
          </div>

          {/* calendar placeholder */}
          <div className="mt-2 border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Availability (Next 30 Days)</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {Array.from({ length: 30 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                const formatted = d.toISOString().slice(0, 10);
                const booked = bookedDates.includes(formatted);
                return (
                  <div key={i} className={`p-1 rounded ${booked ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700"}`}>
                    {d.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="block lg:hidden mt-4">
        <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200">
          {latitude && longitude && MAP_KEY ? (
            <a href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`} target="_blank" rel="noreferrer noopener">
              <img src={staticMapUrl(latitude, longitude, MAP_KEY)} alt="Map preview" className="w-full h-full object-cover" />
            </a>
          ) : (
            <img src="/map-placeholder.png" alt="Map placeholder" className="w-full h-full object-cover" />
          )}
        </div>
      </div>
    </div>
  );
}
