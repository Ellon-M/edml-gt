// components/FeaturedCarouselClient.tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export type FeaturedItem = {
  id: string;
  slug?: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
};

export default function FeaturedCarouselClient({ properties }: { properties: FeaturedItem[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = Math.max(280, Math.min(340, window.innerWidth * 0.7)); // approximate card width depending on viewport
    const scrollAmount = cardWidth + 24; // includes gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!properties || properties.length === 0) {
    return (
      <section className="w-full mt-16 py-12 px-6 md:px-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Properties</h2>
          <Link href="/properties" className="text-sm font-semibold text-[#800000] hover:underline">
            Discover More Homes
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 text-center text-gray-600 shadow-sm">
          No featured properties yet. Add featured listings from the admin panel.
        </div>
      </section>
    );
  }

  return (
    <motion.section
  className="w-full mt-[200px] md:mt-12 py-12 md:py-8 px-6 md:px-12"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold">Featured Properties</h2>
        <Link href="/properties" className="text-right md:text-left font-semibold text-[#800000] hover:underline">
          <span className="hidden md:block">Discover More Homes</span>
          <ChevronRight size={20} color="#800000" className="md:hidden" />
        </Link>
      </div>

      {/* Scrollable area */}
      <div className="relative">
        {/* Scroll Buttons (desktop) */}
        <button
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow-md rounded-full hidden md:flex z-10"
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow-md rounded-full hidden md:flex z-10"
          onClick={() => scroll("right")}
        >
          <ChevronRight size={20} />
        </button>

        <motion.div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {properties.map((property, index) => {
            const imageSrc = property.images && property.images.length ? property.images[0] : "/images/placeholder.png";
            return (
              <motion.article
                key={property.id}
                className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] lg:min-w-[320px] flex-shrink-0 bg-white shadow-md rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                style={{ scrollSnapAlign: "start" }}
              >
                <Link href={`/properties/${property.slug ?? property.id}`} className="block">
                  <div className="relative w-full h-[180px] md:h-[200px] bg-gray-100">
                    <Image
                      src={imageSrc}
                      alt={property.title}
                      fill
                      sizes="(max-width: 640px) 80vw, 320px"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL="/images/placeholder.png"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{property.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{property.location}</p>

                    <div className="flex items-center mt-2 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                          {property.rating ? property.rating.toFixed(1) : "—"}
                        </span>
                        <span className="text-sm text-gray-600 hidden sm:inline">Top rated</span>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold">$ {property.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">/ night</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
