"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Blurhash } from "react-blurhash";
import { Search, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState(""); // you can change to structured start/end
  const [guests, setGuests] = useState("");
  const router = useRouter();

  const onSearch = () => {
    const params = new URLSearchParams();
    if (destination.trim()) params.set("q", destination.trim());
    if (dates.trim()) {
      // if you store as "start - end", you might parse or send as `dates=...`
      params.set("dates", dates.trim());
    }
    if (guests.trim()) params.set("guests", guests.trim());
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative w-full h-[50vh] pt-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        {!isLoaded && (
          <Blurhash
            hash="|ML|=X?b.7NGtRNaIUIUni*0XSV?t7M_n~Rjf6R*=wi^RljFRkjvt7xuR*b_WFofogxuozt7ofsm?bM_M{M{xuxtt7ofa}-pWARka#WWogofozkC9Ft8-pt8RiRjM{aen$RiRjR%V@M{WBRjWBRjM{ofozj]kDoLt7oLt7"
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
            className="absolute inset-0 w-full h-full"
          />
        )}
        <Image
          src="/bnb-cover6.jpg"
          alt="Landing Cover"
          layout="fill"
          objectFit="cover"
          placeholder="empty"
          onLoad={() => setIsLoaded(true)}
          priority
          quality={90}
          className="brightness-55"
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Where Every Stay Feels Like Home
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mt-1 md:mt-2 text-base md:text-lg md:text-xl opacity-80"
        >
          Discover unique stays tailored for you.
        </motion.p>
      </div>

      {/* Search Bar */}
      <div className="relative flex justify-center mt-[-80px] md:mt-[-40px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-[90%] md:w-[80%] lg:w-[60%] bg-white shadow-lg rounded-xl p-4 flex flex-col md:flex-row 
                   items-center gap-2 min-h-[70px] border border-gray-200"
        >
          {/* Destination Input */}
          <div className="w-full flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder="Where would you like a stay?"
              className="pl-12 py-6 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {/* Date Picker */}
          <div className="w-full md:w-1/4 relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder="Check-in - Check-out"
              className="pl-12 py-6 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
            />
          </div>

          {/* Guests Selector */}
          <div className="w-full md:w-1/6 relative">
            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder="Guests"
              className="pl-12 py-6 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <Button onClick={onSearch} className="w-full md:w-auto bg-[#800000] text-white px-10 py-6 rounded-lg hover:bg-[#340000] transition">
            Search
          </Button>
        </motion.div>
      </div>
    </section>
  );
}