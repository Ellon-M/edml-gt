"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// -----------------------------
// PhotoCarouselModal
// Full-screen modal carousel used when user clicks the +N photos link
// -----------------------------
export default function PhotoCarouselModal({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  function prev() {
    setIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }
  function next() {
    setIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[70vh] bg-black/90 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
      >
        {/* slides */}
        <div
          className="h-full flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / images.length)}%)`,
            width: `${images.length * 100}%`,
          }}
        >
          {images.map((src, i) => (
            <div
              key={src + i}
              className="h-full flex-shrink-0 flex items-center justify-center"
              style={{ width: `${100 / images.length}%` }} // 👈 each slide gets its fraction
            >
              <img
                src={src}
                alt={`Photo ${i + 1}`}
                className="max-h-full w-auto max-w-full object-contain rounded"
                style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.6)" }}
              />
            </div>
          ))}
        </div>

        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-gray-300 hover:bg-gray-500 hover:text-white p-2 transition duration-200"
          aria-label="Close gallery"
        >
          <X size={20} />
        </button>

        {/* arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-gray-300 hover:bg-gray-500 hover:text-white p-3 transition duration-200"
          aria-label="Previous photo"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-gray-300 hover:bg-gray-500 hover:text-white p-3 transition duration-200"
          aria-label="Next photo"
        >
          <ChevronRight size={20} />
        </button>

        {/* pagination dots */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${
                i === index ? "bg-white" : "bg-white/30"
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>

        {/* caption / counter */}
        <div className="absolute left-4 bottom-4 z-20 text-sm text-white/80">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
