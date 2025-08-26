"use client";

import React, { useEffect, useRef, useState } from "react";

// -----------------------------
// ReviewsCarousel (simple, responsive)
// -----------------------------
export default function ReviewsCarousel({ reviews }: { reviews: { name: string; avatar?: string; country?: string; text: string }[] }) {
  const [pos, setPos] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    function calc() {
      const w = window.innerWidth;
      if (w >= 1024) setItemsPerPage(3);
      else if (w >= 768) setItemsPerPage(2);
      else setItemsPerPage(1);
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const maxPos = Math.max(0, Math.ceil(reviews.length / itemsPerPage) - 1);

  function prev() {
    setPos((p) => Math.max(0, p - 1));
  }
  function next() {
    setPos((p) => Math.min(maxPos, p + 1));
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg lg:text-xl font-bold">Guest reviews</h3>
        <div className="flex gap-2">
          <button onClick={prev} className="p-2 rounded-md border" aria-label="Previous reviews">‹</button>
          <button onClick={next} className="p-2 rounded-md border" aria-label="Next reviews">›</button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${pos * 100}%)` }}
        >
          {/* build pages */}
          {Array.from({ length: maxPos + 1 }).map((_, pageIdx) => (
            <div key={pageIdx} className="min-w-full">
              <div className={`grid gap-4 ${itemsPerPage === 3 ? 'lg:grid-cols-3 md:grid-cols-2 grid-cols-1' : itemsPerPage === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {reviews.slice(pageIdx * itemsPerPage, pageIdx * itemsPerPage + itemsPerPage).map((r, i) => (
                  <div key={r.name + i} className="bg-white rounded-lg p-4 border shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={r.avatar || '/images/avatar-placeholder.png'} alt={`${r.name} avatar`} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold">{r.name}</div>
                        <div className="text-sm text-gray-500">{r.country}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
