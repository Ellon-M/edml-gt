"use client"

import Link from "next/link";
import { motion } from "framer-motion";

export default function ListYourProperty() {
  return (
    <section className="w-full bg-gradient-to-r from-[#800000] to-[#a52a2a] text-white py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Heading */}
        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold"
        >
          Want to Earn from Your Property?
        </motion.h2>

        <motion.p
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 text-lg md:text-xl"
        >
          List your property with us today and connect with thousands of potential tenants and buyers.
        </motion.p>

        {/* Sign Up Button */}
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-6"
        >
          <Link href="/signup">
            <button className="bg-white text-[#800000] font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
              List Your Property
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
