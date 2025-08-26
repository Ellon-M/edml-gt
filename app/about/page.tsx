"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    id: "what-we-do",
    title: "What We Do",
    content: `We are a tech-driven real estate company that empowers property owners and hosts to take full control of their listings, bookings, and income — all in one powerful platform. Whether you're managing a single apartment or a portfolio of short-term rentals, we give you the tools to succeed in today's competitive accommodation market.

Our platform is built to support every aspect of your hosting journey. From listing your property with <strong style="color: #800000;">rich media</strong> and <strong style="color: #800000;">dynamic pricing tools</strong>, to managing guest communication, calendar availability, and reviews — we've streamlined it all.

Think of us as your partner in hospitality: we bring <strong style="color: #800000;">visibility, automation, and control</strong> to your fingertips, so you can focus on growing your business and delivering exceptional guest experiences.`,
  },
  {
    id: "what-we-offer",
    title: "What We Offer",
    content: `Our services are built around flexibility, scalability, and simplicity. Here’s what makes us different:

<strong style="color: #800000;">Self-Managed Listings:</strong> You are in full control — create, edit, and manage your listings with ease. Add descriptions, pricing, availability, and photos any time, anywhere.

<strong style="color: #800000;">Revenue Optimization Tools:</strong> Use intelligent pricing suggestions, seasonal rate adjustments, and occupancy analytics to maximize your earnings.

<strong style="color: #800000;">Multi-Channel Exposure:</strong> Automatically sync your listings across multiple booking platforms (including Airbnb and Booking.com) while managing everything from a single dashboard.

<strong style="color: #800000;">Guest Messaging Hub:</strong> Communicate with guests before, during, and after their stay with a unified inbox and automated message templates.

<strong style="color: #800000;">Payout Management:</strong> Secure, transparent, and timely payment options directly to your bank account or preferred wallet.

Whether you're a first-time host or an experienced property manager, we provide all the tools you need to succeed — without the high commission rates or rigid contracts of traditional booking platforms.`,
  },
  {
    id: "contact-us",
    title: "Where to Find & Contact Us",
    content: `We're committed to providing world-class support and maintaining strong relationships with our hosts and guests. Here’s how you can reach us:
<strong><a><i style="color: #800000;">support@edmorlistings.com</i></a></strong>
<strong><a><i style="color: #800000;">+254 759 014 111 | +254 794 646 449 | +254 112 033 234 </i></a></strong>

You can also visit our offices in person or drop by for a consultation:
<strong><i style="color: #800000;">SK Offices Next to Ibis Styles Hotel 4th Floor, Suite F4 Rhapta Road Westlands, Nairobi, Kenya</i></strong>

Let’s build the future of hospitality — together.`,
  },
];

export default function AboutUsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((sec) => sec.id === entry.target.id);
            setActiveIndex(idx);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.6 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
	  <Navbar />
      <div className="min-h-screen flex pt-16">
        {/* Sidebar */}
        <nav className="hidden lg:flex flex-col fixed top-1/3 left-10 space-y-6">
          {sections.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => {
                sectionRefs.current[idx]?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className={`flex items-center space-x-3 focus:outline-none cursor-pointer hover:text-gray-900 transition duration-300 ${
                activeIndex === idx
                  ? "text-[#800000] font-semibold"
                  : "text-gray-600"
              }`}
            >
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  activeIndex === idx
                    ? "border-[#800000] bg-[#80000060]"
                    : "border-gray-300 bg-transparent"
                }`}
              >
                {idx + 1}
              </span>
              <span>{sec.title}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 px-6 lg:pl-64 py-20 space-y-28">
          {sections.map((sec, idx) => (
            <section
              key={sec.id}
              id={sec.id}
              ref={(el) => {
                sectionRefs.current[idx] = el;
              }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-4">{sec.title}</h2>
              <div
                className="text-lg leading-relaxed text-gray-600 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: sec.content }}
              />
            </section>
          ))}
        </div>
      </div>
	  <Footer />
    </>
  );
}
