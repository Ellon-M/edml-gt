"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const properties = [
  {
    id: 1,
    image: "/property1.jpeg",
    title: "Elite Apartment",
    location: "Westlands, Nairobi",
    rating: 9.5,
    price: 65,
  },
  {
    id: 2,
    image: "/property2.jpeg",
    title: "Pearl Apartment",
    location: "Kilimani, Nairobi",
    rating: 8.9,
    price: 110,
  },
  {
    id: 3,
    image: "/property3.jpeg",
    title: "Casa Bella",
    location: "Kileleshwa, Nairobi",
    rating: 9.2,
    price: 70,
  },
  {
    id: 4,
    image: "/property-4.webp",
    title: "Serenity Haven",
    location: "Westlands, Nairobi",
    rating: 9.0,
    price: 140,
  },
  {
    id: 5,
    image: "/property5.jpg",
    title: "Ruthie's Nest",
    location: "Kileleshwa, Nairobi",
    rating: 9.8,
    price: 500,
  },
  {
    id: 6,
    image: "/property6.jpg",
    title: "Savannah Breeze",
    location: "Nyali, Mombasa",
    rating: 8.7,
    price: 110,
  },
  {
    id: 7,
    image: "/property-2.webp",
    title: "Skyline View",
    location: "Nyali, Mombasa",
    rating: 9.1,
    price: 70,
  },
];

export default function PropertyList() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Adjust based on card width
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.section
      className="w-full mt-16 py-32 md:py-8 px-6 md:px-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-2xl md:text-3xl font-bold">Featured Properties</h2>
        <Link
          href="/properties"
          className="text-right md:text-left font-semibold text-blue-600 hover:underline"
        >
          <span className="hidden md:block">Discover More Homes</span>
          <ChevronRight size={20} color="#800000" className="md:hidden" />
        </Link>
      </div>

      {/* Scrollable Section */}
      <div className="relative">
        {/* Scroll Buttons */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow-md rounded-full hidden md:flex"
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow-md rounded-full hidden md:flex"
          onClick={() => scroll("right")}
        >
          <ChevronRight size={24} />
        </button>

        {/* Property Cards - Scrollable */}
        <motion.div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth no-scrollbar"
          style={{ scrollSnapType: "x mandatory" }} // Ensures smooth scrolling stop points
        >
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              className="min-w-[280px] md:min-w-[300px] lg:min-w-[320px] flex-shrink-0 bg-white shadow-md rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered effect
            >
              {/* Image */}
              <Image
                src={property.image}
                alt={property.title}
                width={320}
                height={200}
                className="w-full h-[200px] object-cover"
              />

              {/* Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{property.title}</h3>
                <p className="text-gray-500">{property.location}</p>

                {/* Rating */}
                <div className="flex items-center mt-2">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-lg font-bold">
                    {property.rating.toFixed(1)}
                  </span>
                  <span className="ml-2 text-sm text-gray-600"></span>
                </div>

                {/* Price */}
                <p className="mt-3 text-lg font-bold">
                  ${property.price}{" "}
                  <span className="text-sm text-gray-500">/ night</span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
