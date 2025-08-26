"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const blogs = [
  {
    id: 1,
    title: "Maximizing Your Listing's Exposure",
    excerpt:
      "Learn tips and tricks to make your property stand out and attract more guests.",
    image: "/bnbblog.jpg",
  },
  {
    id: 2,
    title: "Designing a Cozy Rental Space",
    excerpt: "Key design elements to create a warm and welcoming atmosphere.",
    image: "/bnbblog2.jpg",
  },
  {
    id: 3,
    title: "Pricing Strategies for Hosts",
    excerpt: "How to price competitively while maximizing your revenue.",
    image: "/bnbblog3.jpg",
  },
];

export default function BlogPreview() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((prev) => (prev + 1) % blogs.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + blogs.length) % blogs.length);
  return (
<section className="w-full py-20 px-6 md:px-12 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#800000]">
              Latest from Our Blog
            </h2>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              Stay informed with expert advice, design inspiration, and hosting strategies to elevate your rental business.
            </p>
          </motion.div>

          {/* Slider Container */}
          <div className="w-full md:w-1/2 relative h-[24rem]">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={blogs[current].id}
                className="absolute inset-0 w-full max-w-md mx-auto rounded-2xl shadow-lg bg-white"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -50) next();
                  else if (info.offset.x > 50) prev();
                }}
              >
                <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
                  <Image
                    src={blogs[current].image}
                    alt={blogs[current].title}
                    layout="fill"
                    objectFit="cover"
                    quality={90}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {blogs[current].title}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    {blogs[current].excerpt}
                  </p>
                   <Link href={`/blog/${blogs[current].id}`} className="mt-6 inline-block px-4 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#900000] transition">
                      Read More
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            <button
              onClick={prev}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition z-20"
            >
              <ChevronLeft size={24} className="text-[#800000]" />
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition z-20"
            >
              <ChevronRight size={24} className="text-[#800000]" />
            </button>
          </div>
        </div>
      </section>
  );
}
