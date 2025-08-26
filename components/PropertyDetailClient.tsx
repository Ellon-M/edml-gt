// components/PropertyDetailClient.tsx
"use client";

import React, { useState } from "react";
import PhotoGridWithCalendar from "./PhotoGridWithCalendar";
import AmenitiesList from "@/components/AmenitiesList";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import PhotoCarouselModal from "@/components/PhotoCarouselModal";
import { cloudinaryTransform, isCloudinaryUrl } from "@/lib/cloudinary";
import { FACILITIES } from "@/lib/facilities";

 function normalizeKey(s: string | undefined) {
  if (!s) return "";
  return String(s)
    .toLowerCase()
    .trim()
    // remove quotes and punctuation except dashes and spaces
    .replace(/^[\s"'`]+|[\s"'`]+$/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ");
}

export default function PropertyDetailClient({ prop }: any) {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselStart, setCarouselStart] = useState(0);
  const openCarousel = (startIndex: number) => {
    setCarouselStart(startIndex);
    setCarouselOpen(true);
  };

  const transformedImages = (prop.images ?? []).map((url: string) =>
    isCloudinaryUrl(url) ? cloudinaryTransform(url, "c_fill,w_1600,q_auto,f_auto") : url
  );

  const dummyBookedDates = (() => {
    const out: string[] = [];
    const base = new Date();
    const offsets = [2, 4, 7, 12, 17, 25];
    offsets.forEach((o) => {
      const d = new Date(base);
      d.setDate(base.getDate() + o);
      out.push(d.toISOString().slice(0, 10));
    });
    return out;
  })();

  const amenities = prop.amenities && prop.amenities.length ? prop.amenities : ["Wifi", "Free parking", "Air conditioning", "Kitchen"];

  // Build facility groups from prop.facilities (strings)
  const selectedFacilities: string[] = (prop.facilities ?? []).map((f: any) => String(f));

  // build a normalized set of saved strings for quick lookup
  const normalizedSaved = selectedFacilities.map((s) => normalizeKey(s));

  // group the saved items into categories, using normalized matching (substring / equality)
  const facilityGroups = FACILITIES.map((cat) => {
    const matchedItems: string[] = [];

    for (const candidate of cat.items) {
      const candKey = normalizeKey(candidate);
      // if any saved facility matches the candidate by substring or equality -> include it
      const matched = normalizedSaved.some((savedKey) => {
        return savedKey === candKey || savedKey.includes(candKey) || candKey.includes(savedKey);
      });
      if (matched) matchedItems.push(candidate);
    }

    return { ...cat, items: matchedItems };
  }).filter((g) => (g.items && g.items.length > 0) || g.isNote);
  
console.log("prop facilities", prop);
console.log("selected facilities", selectedFacilities);

  

  const dummyReviews = [
    { name: "Maria H.", avatar: "/images/avatar1.jpg", country: "Spain", text: "Amazing stay — the location was perfect and the apartment was spotless." },
    { name: "James T.", avatar: "/images/avatar2.jpg", country: "UK", text: "Great host and quick responses. Would stay again." },
  ];

  return (
    <div>
      <section className="mb-8">
        <PhotoGridWithCalendar photos={transformedImages} onOpen={openCarousel} bookedDates={dummyBookedDates} latitude={prop.latitude ?? undefined} longitude={prop.longitude ?? undefined} />
      </section>

      <section className="mb-8">
        <h2 className="text-lg lg:text-xl font-bold mb-2">About this Property</h2>
        <p className="text-gray-700 leading-relaxed">{prop.description ?? ""}</p>
      </section>

      <section className="mb-8">
        <AmenitiesList items={amenities} />
      </section>

      {/* Facilities: dynamic */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Facilities</h3>

        <div className="columns-1 sm:columns-2 lg:columns-3" style={{ columnGap: "2rem" }}>
          {facilityGroups.map((cat: any) => {
            // render icon as a component (don't call as function)
            const Icon = cat.icon as React.ComponentType<any>;
            return (
              <div key={cat.title} className="inline-block w-full mb-3" style={{ breakInside: "avoid" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 text-gray-700 flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="font-medium">{cat.title}</div>
                </div>

                {cat.isNote ? (
                  <p className="text-sm text-gray-600">{cat.items[0]}</p>
                ) : (
                  <ul className="text-sm text-gray-700">
                    {cat.items.map((it: string) => (
                      <li key={it} className="flex items-start gap-2 mb-1">
                        <svg className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <ReviewsCarousel reviews={dummyReviews} />
      </section>

      {carouselOpen && (
        <PhotoCarouselModal images={transformedImages} startIndex={carouselStart} onClose={() => setCarouselOpen(false)} />
      )}
    </div>
  );
}
